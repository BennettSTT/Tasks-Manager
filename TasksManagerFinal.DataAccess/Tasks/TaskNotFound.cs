using System;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public class TaskNotFound : Exception
    {
        public TaskNotFound()
            : base("Task not found in database") { }
    }
}
