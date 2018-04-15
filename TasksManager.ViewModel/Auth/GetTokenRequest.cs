using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.ViewModel.Auth
{
    public class GetTokenRequest
    {
        [Required]
        [MaxLength(64)]
        public string Email { get; set; }
        
        [Required]
        [MaxLength(64)]
        public string Password { get; set; }
    }
}
