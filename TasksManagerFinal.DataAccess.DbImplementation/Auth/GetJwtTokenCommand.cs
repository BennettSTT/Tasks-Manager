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
    public class GetJWTTokenCommand : IGetJWTTokenCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IAuthJWTTokenServices TokenServices { get; }

        public GetJWTTokenCommand(IUnitOfWork uow, IAsyncQueryableFactory factory,
            IAuthJWTTokenServices tokenServices)
        {
            Factory = factory;
            Uow = uow;
            TokenServices = tokenServices;
        }

        public async Task<GetTokenResponse> ExecuteAsync(GetTokenRequest getTokenRequest)
        {
            //var t = new RefreshToken
            //{
            //    Token = Guid.NewGuid().ToString().Replace("-", ""),
            //};

            //var user1 = new User
            //{
            //    Email = "1@mail.ru",
            //    Password = "123456",
            //    Role = "admin",
            //    RefreshToken = t.Token
            //};
            //t.UserId = user1.Id;
            //Uow.UsersRepository.Add(user1);
            //await Uow.CommitAsync();

            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            var user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Email == getTokenRequest.Email && u.Password == getTokenRequest.Password);

            if (user == null) throw new Exception("user not found");

            var now = DateTime.UtcNow;
            var expires = TokenServices.GetExpires(now);

            var accessToken = TokenServices.GetAccessToken(user, now, expires);
            var refreshToken = TokenServices.GetRefreshToken(user);

            user.RefreshToken = refreshToken.Token;
            //user.ExpiresInRefreshToken = expires;

            Uow.UsersRepository.Update(user);
            await Uow.CommitAsync();

            return new GetTokenResponse
            {
                accessToken = accessToken,
                refreshToken = refreshToken,
                expiresIn = expires.ToString(CultureInfo.InvariantCulture)
            };
        }
    }
}
