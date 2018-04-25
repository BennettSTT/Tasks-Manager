using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.DbImplementation.Tasks
{
    public class TaskListQuery : ITaskListQuery
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public ITasksServices TasksServices { get; }

        public TaskListQuery(IUnitOfWork uow, IAsyncQueryableFactory factory, ITasksServices tasksServices)
        {
            Uow = uow;
            Factory = factory;
            TasksServices = tasksServices;
        }

        public async Task<IEnumerable<TaskResponse>> RunAsync(string login, string title, int level)
        {
            Project project = await Factory.CreateAsyncQueryble(Uow.ProjectsRepository.Query()
                    .Include(p => p.User)
                    .Select(p => p)
                )
                .FirstOrDefaultAsync(p => p.Title == title && p.User.Login == login);

            if (project == null) throw new ProjectNotFound();

            return await TasksServices.GetRoot(project.Id, level);
        }
    }
}
