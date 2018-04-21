using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.Entities
{
    public class RefreshTokenObject
    {
        [Key]
        public string Token { get; set; }
        public int UserId { get; set; }
    }
}
