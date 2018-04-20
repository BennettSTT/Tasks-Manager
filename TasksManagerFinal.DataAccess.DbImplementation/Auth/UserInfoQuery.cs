using System;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.DbImplementation.Auth
{
    public class UserInfoQuery : IUserInfoQuery
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }

        public UserInfoQuery(IUnitOfWork uow, IAsyncQueryableFactory factory)
        {
            Factory = factory;
            Uow = uow;
        }

        public async Task<UserInfoResponse> ExecuteAsync(int userId)
        {
            var query = Uow.UsersRepository.Query()
                .Select(u => u);

            User user = await Factory.CreateAsyncQueryble(query)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) throw new Exception("User not found");
 
            return new UserInfoResponse
            {
                login = user.Login,
                refreshToken = user.UserRefreshToken
            };
        }
    }
}
