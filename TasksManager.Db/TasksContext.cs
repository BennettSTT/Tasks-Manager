using Microsoft.EntityFrameworkCore;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.Db
{
    public class TasksContext : DbContext
    {
        public TasksContext(DbContextOptions<TasksContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<RefreshTokenObject> RefreshTokenObjects { get; set; }
    }
}