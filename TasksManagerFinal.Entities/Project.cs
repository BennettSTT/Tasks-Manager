using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

        public ICollection<Task> Tasks { get; set; }
    }
}
