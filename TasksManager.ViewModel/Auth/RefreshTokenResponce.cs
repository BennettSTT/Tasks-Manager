using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class RefreshTokenResponce
    {
        public string accessToken { get; set; }
        public RefreshToken refreshToken { get; set; }
        public string expiresIn { get; set; }
    }
}
