using System.Linq;
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
        private IAsyncQueryableFactory Factory { get; }

        public CreateProjectCommand(IUnitOfWork uow, IAsyncQueryableFactory factory)
        {
            Uow = uow;
            Factory = factory;
        }

        public async Task<ProjectResponse> ExecuteAsync(string email, CreateProjectRequest request)
        {
            var queruUser = Uow.UsersRepository.Query()
                .Select(u => u);

            User user = await Factory.CreateAsyncQueryble(queruUser)
                .FirstOrDefaultAsync(u => u.Email == email);

            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                UserId = user.Id,
                InArchive = false,
                User = user
            };

            Uow.ProjectsRepository.Add(project);

            await Uow.CommitAsync();

            return new ProjectResponse
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                InArchive = project.InArchive,
                OpenTasksCount = project.OpenTasksCount
            };
        }
    }
}
