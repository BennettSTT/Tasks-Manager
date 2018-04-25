using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class UpdateProjectCommand : IUpdateProjectCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IMapper Mapper { get; }

        public UpdateProjectCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, IMapper mapper)
        {
            Uow = uow;
            Factory = factory;
            Mapper = mapper;
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

            return Mapper.Map<Project, ProjectResponse>(project);
        }
    }
}
