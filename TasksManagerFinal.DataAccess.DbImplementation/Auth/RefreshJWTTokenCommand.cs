using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.DbImplementation.Auth
{
    public class RefreshJWTTokenCommand : IRefreshJWTTokenCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IAuthJWTTokenServices TokenServices { get; }

        public RefreshJWTTokenCommand(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
        }

        public async Task<RefreshTokenResponce> ExecuteAsync(RefreshTokenRequest tokenRequest)
        {
            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            var user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Id == tokenRequest.refreshToken.UserId);

            if (user == null) 
                throw new Exception("user not found");

            if (!user.RefreshToken.Equals(tokenRequest.refreshToken.Token)) 
                throw new Exception("tokens not equals");

            var now = DateTime.UtcNow;
            var expires = TokenServices.GetExpires(now);

            var accessToken = TokenServices.GetAccessToken(user, now, expires);
            var refreshToken = TokenServices.GetRefreshToken(user);

            user.RefreshToken = refreshToken.Token;
            user.ExpiresInRefreshToken = expires;

            Uow.UsersRepository.Update(user);
            await Uow.CommitAsync();

            return new RefreshTokenResponce
            {
                accessToken = accessToken,
                refreshToken = refreshToken,
                expiresIn = expires.ToString(CultureInfo.InvariantCulture)
            };
        }
    }
}
