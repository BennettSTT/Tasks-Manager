using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class ProjectQuery : IProjectQuery
    {
        private IUnitOfWork Uow { get; }
        private IAsyncQueryableFactory Factory { get; }
        private ITasksServices TasksServices { get; }

        public ProjectQuery(IUnitOfWork uow, IAsyncQueryableFactory factory, ITasksServices tasksServices)
        {
            Uow = uow;
            Factory = factory;
            TasksServices = tasksServices;
        }

        public async Task<ProjectResponse> ExecuteAsync(string userLogin, string titleProject)
        {
            var queryProj = Uow.ProjectsRepository.Query()
                .Include(p => p.Tasks)
                .Include(p => p.User)
                .Select(p => p);

            Project project = await Factory.CreateAsyncQueryble(queryProj)
                .FirstOrDefaultAsync(u => u.Title == titleProject && u.User.Login == userLogin);

            foreach (var task in project.Tasks)
            {
                task.Children = TasksServices.GetChildren(task.Id);
            }

            return new ProjectResponse
            {
                Description = project.Description,
                Title = project.Title,
                InArchive = project.InArchive,
                OpenTasksCount = project.OpenTasksCount
            };
        }
    }
}
