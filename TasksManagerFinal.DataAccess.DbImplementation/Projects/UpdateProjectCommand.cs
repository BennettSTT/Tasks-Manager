using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class UpdateProjectCommand : IUpdateProjectCommand
    {
        private IUnitOfWork Uow { get; }
        private IAsyncQueryableFactory Factory { get; }

        public UpdateProjectCommand(IUnitOfWork uow, IAsyncQueryableFactory factory)
        {
            Uow = uow;
            Factory = factory;
        }

        public async Task<ProjectResponse> ExecuteAsunc(int projectId, UpdateProjectRequest request, string user)
        {
            Project project = await Factory.CreateAsyncQueryble(Uow.ProjectsRepository.Query()
                    .Include(p => p.User)
                    .Include(p => p.Tasks)
                    .Select(p => p))
                .FirstOrDefaultAsync(p => p.Id == projectId && p.User.Email == user);

            if (project == null) throw new CannotUpdateProjectNotFound();

            project.Title = request.Title;
            project.Description = request.Description;
            project.InArchive = request.InArchive;

            Uow.ProjectsRepository.Update(project);
            await Uow.CommitAsync();

            return new ProjectResponse
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                InArchive = project.InArchive,
                OpenTasksCount = project.Tasks.Count
            };
        }
    }
}
