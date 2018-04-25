using System;
using System.ComponentModel.DataAnnotations;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Tasks
{
    public class UpdateTaskRequest
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        // Крайний срок
        public DateTime? DueDate { get; set; }
        public DateTime? CompleteDate { get; set; }

        public TaskStatus Status { get; set; }
    }
}
