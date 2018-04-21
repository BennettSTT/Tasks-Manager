using System;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.DbImplementation.Auth
{
    public class RefreshTokenCommand : IRefreshTokenCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IAuthJWTTokenServices TokenServices { get; }

        public RefreshTokenCommand(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
        }

        public async Task<RefreshTokenResponse> ExecuteAsync(RefreshTokenRequest tokenRequest)
        {
            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            var user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Id == tokenRequest.UserId);

            if (user == null) 
                throw new Exception("user not found");

            if (!user.UserRefreshToken.Equals(tokenRequest.Token)) 
                throw new Exception("tokens not equals");

            Token token = TokenServices.GetJWTToken(user);

            Uow.UsersRepository.Update(user);
            await Uow.CommitAsync();

            return new RefreshTokenResponse
            {
                accessToken = token.accessToken,
                refreshToken = token.refreshToken,
                expiresIn = token.expiresIn
            };
        }
    }
}
