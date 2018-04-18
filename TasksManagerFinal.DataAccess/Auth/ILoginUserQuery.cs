using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface ILoginUserQuery
    {
        Task<LoginUserResponse> ExecuteAsync(LoginUserRequest loginUserRequest);
    }
}
