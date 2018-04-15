using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel;

namespace TasksManagerFinal.Services.UnitOfWork
{
    public class AuthJWTTokenServices : IAuthJWTTokenServices
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public JWTAuthOptions JWTAuthOptions { get; }

        public AuthJWTTokenServices(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IOptions<JWTAuthOptions> authOptions)
        {
            Factory = factory;
            Uow = uow;
            JWTAuthOptions = authOptions.Value;
        }

        public DateTime GetExpires(DateTime now)
        {
            return now.Add(TimeSpan.FromMinutes(JWTAuthOptions.LifeTime));
        }

        public string GetAccessToken(User user, DateTime now, DateTime expires)
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

        public RefreshToken GetRefreshToken(User user)
        {
            return new RefreshToken
            {
                Token = Guid.NewGuid().ToString().Replace("-", ""),
                UserId = user.Id
            };
        }
    }
}
