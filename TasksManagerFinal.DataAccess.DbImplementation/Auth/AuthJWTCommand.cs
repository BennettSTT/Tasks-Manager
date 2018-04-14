using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
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

        public async Task<AuthResponce> ExecuteAsync(AuthRequest request)
        {
            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            var user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null) throw new Exception("user not found");

            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role)
            };

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Token",
                ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType
            );

            DateTime now = DateTime.UtcNow;

            SecurityToken token = new JwtSecurityToken(
                issuer: JWTAuthOptions.Issuer,
                audience: JWTAuthOptions.Audience,
                notBefore: now,
                claims: claimsIdentity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(JWTAuthOptions.LifeTime)),
                signingCredentials: new SigningCredentials(
                    JWTAuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256
                )
            );

            var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResponce
            {
                AccessToken = encodedToken,
                UserName = claimsIdentity.Name
            };
        }
    }
}
