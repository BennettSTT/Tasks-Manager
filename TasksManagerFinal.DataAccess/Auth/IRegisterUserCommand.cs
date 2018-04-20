using System.Threading.Tasks;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IRegisterUserCommand
    {
        Task<Token> ExecuteAsync(RegisterUserRequest getTokenRequest);
    }
}
