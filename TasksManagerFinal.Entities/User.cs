using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.Entities
{
    public class User : DomainObject
    {
        [Required]
        [MaxLength(64)]
        public string Email { get; set; }

        [Required]
        [MaxLength(64)]
        public string Login { get; set; }

        [Required]
        [MaxLength(64)]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        public string RefreshToken { get; set; }
    }
}
