using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IRefreshJWTTokenCommand
    {
        Task<RefreshTokenResponce> ExecuteAsync(RefreshTokenRequest tokenRequest);
    }
}
