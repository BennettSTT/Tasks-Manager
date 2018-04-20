using TasksManagerFinal.Entities;

namespace TasksManagerFinal.Services
{
    public interface IAuthJWTTokenServices
    {
        Token GetJWTToken(User user);
    }
}
