using System;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public class CannotDeleteTaskNotFound : Exception
    {
        public CannotDeleteTaskNotFound()
            : base("Cannot delete task: Task not found in database") { }
    }
}
