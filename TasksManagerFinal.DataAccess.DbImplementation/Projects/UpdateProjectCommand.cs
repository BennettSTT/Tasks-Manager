using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class UpdateProjectCommand : IUpdateProjectCommand
    {
        private IUnitOfWork Uow { get; }

        public UpdateProjectCommand(IUnitOfWork uow)
        {
            Uow = uow;
        }

        public async Task<ProjectResponse> ExecuteAsunc(int projectId, UpdateProjectRequest request)
        {
            var project = await Uow.ProjectsRepository.Query()
                .Include(t => t.Tasks)
                .Select(p => p)
                .FirstOrDefaultAsync(pr => pr.Id == projectId);

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
