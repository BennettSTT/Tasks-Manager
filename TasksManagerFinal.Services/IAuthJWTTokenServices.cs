using System;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.Services
{
    public interface IAuthJWTTokenServices
    {
        DateTime GetExpires(DateTime now);
        RefreshToken GetRefreshToken(User user);
        string GetAccessToken(User user, DateTime now, DateTime expires);
        Token GetJWTToken(User user);
    }
}
