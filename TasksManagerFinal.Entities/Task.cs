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

        private TaskStatus _status;
        private DateTime _createDate;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        public int Level { get; set; }

        public int? ParentId { get; set; }
        public Task Parent { get; set; }

        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        // Крайний срок
        public DateTime? DueDate { get; set; }
        public DateTime CreateDate
        {
            get
            {
                if (_createDate == default(DateTime))
                    _createDate = DateTime.Now;
                return _createDate;
            }
            private set => _createDate = value;
        }
        public DateTime? CompleteDate { get; set; }

        [Required]
        public TaskStatus Status
        {
            get
            {
                if (_status == default(TaskStatus)) 
                    _status = TaskStatus.Created;
                return _status;
            }
            set
            {
                if (value == TaskStatus.Completed)
                    CompleteDate = DateTime.Now;
                _status = value;
            }
        }

        public TaskPriority Priority { get; set; }
        public ICollection<Task> Children { get; set; }
    }
}
