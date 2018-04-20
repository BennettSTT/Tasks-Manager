using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Security.Authentication;
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
                    u.Email == loginUserRequest.Login || u.Login == loginUserRequest.Login
                );

            if (user == null) throw new Exception("Login or password is incorrect");

            if (new PasswordHasher<User>()
                    .VerifyHashedPassword(user, user.Password, loginUserRequest.Password) == PasswordVerificationResult.Failed)
                throw new AuthenticationException("Login or password is incorrect");

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
