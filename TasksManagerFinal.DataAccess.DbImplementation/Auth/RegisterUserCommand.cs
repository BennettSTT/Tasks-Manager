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
    public class RegisterUserCommand : IRegisterUserCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IAuthJWTTokenServices TokenServices { get; }

        public RegisterUserCommand(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
        }

        public async Task<RegisterUserResponse> ExecuteAsync(RegisterUserRequest request)
        {
            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            User checkUser = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Email == request.Email || u.Login == request.Login);

            if (checkUser != null) throw new Exception("This Email or Login is already taken");

            User user = new User
            {
                Login = request.Login,
                Email = request.Email, 
                Password = request.Password, 
                Role = "user"
            };

            Token token = TokenServices.GetJWTToken(user);

            Uow.UsersRepository.Add(user);
            await Uow.CommitAsync();

            // Т.к. юзер создается, id появляется только после сохранения юзера в базу
            // Поэтому записываем id руками
            token.refreshToken.UserId = user.Id;

            return new RegisterUserResponse
            {
                token = token,
                user = new User
                {
                    Role = user.Role,
                    Login = user.Login,
                    RefreshToken = token.refreshToken.Token
                }
            };
        }
    }
}
