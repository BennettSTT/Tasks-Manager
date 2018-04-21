using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IRefreshTokenCommand
    {
        Task<RefreshTokenResponse> ExecuteAsync(RefreshTokenRequest tokenRequest);
    }
}
