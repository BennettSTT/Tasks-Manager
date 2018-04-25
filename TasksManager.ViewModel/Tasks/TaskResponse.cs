using System;
using System.Collections.Generic;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.ViewModel.Tasks
{
    public class TaskResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Level { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? CompleteDate { get; set; }

        public TaskPriority Priority { get; set; }
        public TaskStatus Status { get; set; }
        public List<TaskResponse> Children { get; set; }
    }
}
