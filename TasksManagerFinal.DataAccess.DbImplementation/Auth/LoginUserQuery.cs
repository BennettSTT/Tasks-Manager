using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using AutoMapper;
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
        public IMapper Mapper { get; }

        public LoginUserQuery(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices, IMapper mapper)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
            Mapper = mapper;
        }

        public async Task<LoginUserResponse> ExecuteAsync(LoginUserRequest loginUserRequest)
        {
            var user = await Factory.CreateAsyncQueryble(Uow.UsersRepository.Query())
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

            return Mapper.Map<Token, LoginUserResponse>(token);
        }
    }
}
