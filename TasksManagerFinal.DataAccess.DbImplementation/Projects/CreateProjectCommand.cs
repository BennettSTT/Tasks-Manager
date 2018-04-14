using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class CreateProjectCommand : ICreateProjectCommand
    {
        private IUnitOfWork Uow { get; }

        public CreateProjectCommand(IUnitOfWork uow)
        {
            Uow = uow;
        }

        public async Task<ProjectResponse> ExecuteAsync(CreateProjectRequest request)
        {
            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                InArchive = false
            };

            Uow.ProjectsRepository.Add(project);
            
            await Uow.CommitAsync();

            return new ProjectResponse
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                OpenTasksCount = 0
            };
        }
    }
}
