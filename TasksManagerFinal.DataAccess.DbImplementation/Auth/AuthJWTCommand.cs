using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.DbImplementation.Auth
{
    public class AuthJWTCommand : IAuthJWTCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public JWTAuthOptions JWTAuthOptions { get; }

        public AuthJWTCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, 
            IOptions<JWTAuthOptions> authOptions)
        {
            Factory = factory;
            Uow = uow;
            JWTAuthOptions = authOptions.Value;
        }

        public async Task<AuthTokenResponce> ExecuteAsync(AuthRequest request)
        {
            //var t = new RefreshToken
            //{
            //    Token = Guid.NewGuid().ToString().Replace("-", ""),
            //};

            //var user1 = new User
            //{
            //    Email = "Token",
            //    Password = "123456",
            //    Role = "admin",
            //    RefreshToken = t.Token
            //};

            //t.UserId = user1.Id;
            //Uow.UsersRepository.Add(user1);
            //await Uow.CommitAsync();

            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            var user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null) throw new Exception("user not found");

            DateTime now = DateTime.Now;
            DateTime expires = now.Add(TimeSpan.FromMinutes(JWTAuthOptions.LifeTime));

            string accessToken = GetAccessToken(user, now, expires);
            RefreshToken refreshToken = GetRefreshToken(user);

            user.RefreshToken = refreshToken.Token;

            user.ExpiresInRefreshToken = expires;

            Uow.UsersRepository.Update(user);
            await Uow.CommitAsync();

            return new AuthTokenResponce
            {
                accessToken = accessToken,
                refreshToken = refreshToken,
                expiresIn = expires.ToString(CultureInfo.InvariantCulture)
            };
        }

        private string GetAccessToken(User user, DateTime now, DateTime expires)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role)
            };

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Token",
                ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType
            );

            SecurityToken token = new JwtSecurityToken(
                issuer: JWTAuthOptions.Issuer,
                audience: JWTAuthOptions.Audience,
                notBefore: now,
                claims: claimsIdentity.Claims,
                expires: expires,
                signingCredentials: new SigningCredentials(
                    JWTAuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private RefreshToken GetRefreshToken(User user)
        {
            return new RefreshToken
            {
                Token = Guid.NewGuid().ToString().Replace("-", ""),
                UserId = user.Id
            };
        }
    }
}
