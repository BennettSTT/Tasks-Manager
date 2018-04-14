using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.Entities
{
    public class Task : DomainObject
    {
        public Task()
        {
            Children = new List<Task>();
        }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        // Крайний срок
        public DateTime? DueDate { get; set; }
        
        public DateTime CreateDate { get; set; }
        public DateTime? CompleteDate { get; set; }

        // Родитель и его Id
        public int? ParentId { get; set; }
        public Task Parent { get; set; }

        // Проект таска
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public ICollection<Task> Children { get; set; }

        public TaskStatus Status { get; set; }

        public TaskPriority Priority { get; set; }
    }
}
