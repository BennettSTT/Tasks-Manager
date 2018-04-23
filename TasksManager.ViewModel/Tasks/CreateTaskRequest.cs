using System;
using System.ComponentModel.DataAnnotations;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Tasks
{
    public class CreateTaskRequest
    {
        public CreateTaskRequest()
        {
            Priority = TaskPriority.Medium;
        }

        [Required]
        [MaxLength(64)]
        public string Title { get; set; }
        public int ProjectId { get; set; }
        public int? ParentId { get; set; }

        public TaskPriority Priority { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
