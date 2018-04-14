using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IAuthJWTCommand
    {
        Task<AuthResponce> ExecuteAsync(AuthRequest request);
    }
}
