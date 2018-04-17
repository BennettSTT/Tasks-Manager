using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.Entities
{
    public class RefreshToken
    {
        [Key]
        public string Token { get; set; }
        public int UserId { get; set; }
    }
}
