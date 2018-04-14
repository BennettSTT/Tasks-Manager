using System.Collections.Generic;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.Services.UnitOfWork
{
    public interface ITasksServices
    {
        ICollection<Task> GetChildren(int parentId);
    }
}
