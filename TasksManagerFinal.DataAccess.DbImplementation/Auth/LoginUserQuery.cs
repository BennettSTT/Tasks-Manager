using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.DbImplementation.Auth
{
    public class LoginUserQuery : ILoginUserQuery
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IAuthJWTTokenServices TokenServices { get; }

        public LoginUserQuery(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
        }

        public async Task<LoginUserResponse> ExecuteAsync(LoginUserRequest loginUserRequest)
        {
            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            var user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u =>
                    (u.Email == loginUserRequest.Login || u.Login == loginUserRequest.Login)
                    && u.Password == loginUserRequest.Password
                );

            if (user == null) throw new Exception("user not found");

            Token token = TokenServices.GetJWTToken(user);

            Uow.UsersRepository.Update(user);
            await Uow.CommitAsync();

            return new LoginUserResponse
            {
                accessToken = token.accessToken,
                refreshToken = token.refreshToken,
                expiresIn = token.expiresIn
            };
        }
    }
}
