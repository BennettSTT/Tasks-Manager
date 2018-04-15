using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class GetTokenResponce
    {
        public string accessToken { get; set; }
        public RefreshToken refreshToken { get; set; }
        public string expiresIn { get; set; }
    }
}
