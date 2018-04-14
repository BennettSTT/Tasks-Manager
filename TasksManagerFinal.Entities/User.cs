namespace TasksManagerFinal.Entities
{
    public class User : DomainObject
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
