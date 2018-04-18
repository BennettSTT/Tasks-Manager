using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class LoginUserRequest
    {
        [Required]
        [MaxLength(64)]
        public string Login { get; set; }
        
        [Required]
        [MaxLength(64)]
        public string Password { get; set; }
    }
}
