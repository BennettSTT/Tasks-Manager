using System.Threading.Tasks;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IUserInfoQuery
    {
        Task<User> ExecuteAsync(int userId);
    }
}
