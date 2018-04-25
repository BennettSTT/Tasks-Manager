using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.DataAccess.Users;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class ProjectsListQuery : IProjectsListQuery
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IMapper Mapper { get; }

        public ProjectsListQuery(IUnitOfWork uow, IAsyncQueryableFactory factory, IMapper mapper)
        {
            Uow = uow;
            Factory = factory;
            Mapper = mapper;
        }

        public async Task<ListResponse<ProjectResponse>> RunAsync(string login, ProjectFilter filter)
        {
            User user = await Factory.CreateAsyncQueryble(Uow.UsersRepository.Query())
                .FirstOrDefaultAsync(u => u.Login == login);

            if (user == null) throw new UsersNotFound();

            var queryProjects = Uow.ProjectsRepository.Query(t => t.Tasks, t => t.User)
                .Where(u => u.UserId == user.Id)
                .Select(p => Mapper.Map<Project, ProjectResponse>(p));

            queryProjects = ApplyFilter(queryProjects, filter);

            int totalCount = await Factory
                .CreateAsyncQueryble(queryProjects)
                .CountAsync();

            return new ListResponse<ProjectResponse>
            {
                Items = await Factory
                    .CreateAsyncQueryble(queryProjects)
                    .ToListAsync(),
                TotalItemsCount = totalCount
            };
        }

        private IQueryable<ProjectResponse> ApplyFilter(IQueryable<ProjectResponse> query, ProjectFilter filter)
        {
            if (filter.Id != null)
            {
                query = query.Where(pr => pr.Id == filter.Id);
            }

            if (filter.InArchive != null)
            {
                query = query.Where(pr => pr.InArchive == filter.InArchive);
            }

            if (filter.Title != null)
            {
                query = query.Where(pr => pr.Title.StartsWith(filter.Title));
            }

            if (filter.OpenTasksCount != null)
            {
                if (filter.OpenTasksCount.From != null)
                {
                    query = query.Where(pr => pr.OpenTasksCount >= filter.OpenTasksCount.From);
                }

                if (filter.OpenTasksCount.To != null)
                {
                    query = query.Where(pr => pr.OpenTasksCount <= filter.OpenTasksCount.To);
                }
            }

            return query;
        }
    }
}
