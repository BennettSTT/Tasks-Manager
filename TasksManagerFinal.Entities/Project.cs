using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace TasksManagerFinal.Entities
{
    public class Project : DomainObject
    {
        [Required] 
        [MaxLength(250)] 
        public string Title { get; set; }

        [MaxLength(2000)] 
        public string Description { get; set; }

        public bool InArchive { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        [NotMapped]
        public int OpenTasksCount => Tasks?.Count(t => t.Status != TaskStatus.Completed) ?? 0;

        public ICollection<Task> Tasks { get; set; }
    }
}
