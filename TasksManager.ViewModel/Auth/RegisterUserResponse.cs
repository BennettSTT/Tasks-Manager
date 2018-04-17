using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class RegisterUserResponse
    {
        public Token token { get; set; }
        public User user { get; set; }
    }
}
