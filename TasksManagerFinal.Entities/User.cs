using System.Collections.Generic;
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
        [MaxLength(516)]
        public string Password { get; set; }

        public string UserRefreshToken { get; set; }

        public ICollection<Project> Projects { get; set; }
    }
}
