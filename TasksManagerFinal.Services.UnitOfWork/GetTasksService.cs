using System.Collections.Generic;
using System.Linq;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.Services.UnitOfWork
{
    public class GetTasksService : ITasksServices
    {
        public IUnitOfWork Uow { get; set; }

        public GetTasksService(IUnitOfWork uow)
        {
            Uow = uow;
        }

        public ICollection<Task> GetChildren(int parentId)
        {
            List<Task> children = Uow.TasksRepository.Query()
                .Where(g => g.ParentId == parentId)
                .ToList();

            foreach (Task child in children)
            {
                int id = child.Id;
                child.Children = GetChildren(id);
            }

            return children;
        }
    }
}
