using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.DbImplementation.Auth
{
    public class RegisterUserCommand : IRegisterUserCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IAuthJWTTokenServices TokenServices { get; }
        public IMapper Mapper { get; }

        public RegisterUserCommand(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices, IMapper mapper)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
            Mapper = mapper;
        }

        public async Task<Token> ExecuteAsync(RegisterUserRequest request)
        {
            User checkUser = await Factory.CreateAsyncQueryble(
                    Uow.UsersRepository.Query()
                        .Select(u => u)
                )
                .FirstOrDefaultAsync(u => u.Email == request.Email || u.Login == request.Login);

            if (checkUser != null) throw new Exception("This Email or Login is already taken");

            User user = Mapper.Map<RegisterUserRequest, User>(request);

            user.Password = new PasswordHasher<User>().HashPassword(user, user.Password);

            Token token = TokenServices.GetJWTToken(user);

            Uow.UsersRepository.Add(user);
            await Uow.CommitAsync();

            // Т.к. юзер создается, id появляется только после сохранения юзера в базу
            // Поэтому записываем id руками
            token.refreshToken.UserId = user.Id;

            return token;
        }
    }
}
