using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IUserInfoQuery
    {
        Task<UserInfoResponse> ExecuteAsync(int userId);
    }
}
