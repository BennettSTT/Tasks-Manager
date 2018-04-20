using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class LoginUserResponse
    {
        public string accessToken { get; set; }
        public RefreshTokenObject refreshToken { get; set; }
        public string expiresIn { get; set; }
    }
}
