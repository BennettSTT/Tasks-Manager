using AutoMapper;
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
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public ITasksServices TasksServices { get; }
        public IMapper Mapper { get; }

        public ProjectQuery(IUnitOfWork uow, IAsyncQueryableFactory factory,
            ITasksServices tasksServices, IMapper mapper)
        {
            Uow = uow;
            Factory = factory;
            TasksServices = tasksServices;
            Mapper = mapper;
        }

        public async Task<ProjectResponse> ExecuteAsync(string login, string titleProject)
        {
            Project project = await Factory.CreateAsyncQueryble(
                    Uow.ProjectsRepository.Query(p => p.Tasks, p => p.User)
                )
                .FirstOrDefaultAsync(u => u.Title == titleProject && u.User.Login == login);

            if (project == null) throw new ProjectNotFound();

            return Mapper.Map<Project, ProjectResponse>(project);
        }
    }
}
