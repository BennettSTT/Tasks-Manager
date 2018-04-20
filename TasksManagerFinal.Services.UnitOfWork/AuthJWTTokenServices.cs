using System;
using System.Collections.Generic;
using System.Globalization;
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

        public Token GetJWTToken(User user)
        {
            var now = DateTime.UtcNow;
            var expires = now.Add(TimeSpan.FromMinutes(JWTAuthOptions.LifeTime));

            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email)
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

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = new RefreshTokenObject
            {
                Token = Guid.NewGuid().ToString().Replace("-", ""),
                UserId = user.Id
            };

            // Добавляем refreshToken юзеру для сохранения в бд
            // И последующего хранения на клиенте
            user.UserRefreshToken = refreshToken.Token;

            return new Token
            {
                accessToken = accessToken,
                refreshToken = refreshToken,
                expiresIn = expires.ToString(CultureInfo.InvariantCulture)
            };
        }
    }
}
