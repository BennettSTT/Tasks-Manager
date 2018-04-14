using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IAuthJWTCommand
    {
        Task<AuthTokenResponce> ExecuteAsync(AuthRequest request);
    }
}
