using System;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class UserInfoResponse
    {
        public string login { get; set; }
        public string role { get; set; }
        public string refreshToken { get; set; }
        public DateTime expiresInRefreshToken { get; set; }
    }
}
