using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class GetProjectQuery : IGetProjectQuery
    {
        private IUnitOfWork Uow { get; }
        private IAsyncQueryableFactory Factory { get; }

        public GetProjectQuery(IUnitOfWork uow, IAsyncQueryableFactory factory)
        {
            Uow = uow;
            Factory = factory;
        }

        public async Task<Project> ExecuteAsync(int projectId)
        {
            Project project = await Factory.CreateAsyncQueryble(Uow.ProjectsRepository.Query()
                    .Include(p => p.User)
                    .Include(p => p.Tasks)
                    .Select(p => p))
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) throw new ProjectNotFound();

            return project;
        }
    }
}
