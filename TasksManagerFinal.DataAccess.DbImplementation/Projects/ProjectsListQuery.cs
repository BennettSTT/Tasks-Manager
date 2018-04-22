using System.Linq;
using System.Threading.Tasks;
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
        private IUnitOfWork Uow { get; }
        private IAsyncQueryableFactory Factory { get; }

        public ProjectsListQuery(IUnitOfWork uow, IAsyncQueryableFactory factory)
        {
            Uow = uow;
            Factory = factory;
        }

        public async Task<ListResponse<ProjectResponse>> RunAsync(string login, ProjectFilter filter, ListOptions options)
        {
            User user = await Factory.CreateAsyncQueryble(
                    Uow.UsersRepository.Query()
                    .Select(u => u)
                    )
                .FirstOrDefaultAsync(u => u.Login == login);

            if (user == null) throw new UsersNotFound();

            var queryProjects = Uow.ProjectsRepository.Query()
                .Select(u => u)
                .Where(u => u.UserId == user.Id)
                .Select(p => new ProjectResponse
                {
                    Id = p.Id,
                    Title = p.Title,
                    InArchive = p.InArchive,
                    Description = p.Description,
                    OpenTasksCount = p.OpenTasksCount
                });



            if (options.Sort == null)
            {
                options.Sort = "Id";
            }

            queryProjects = ApplyFilter(queryProjects, filter);

            int totalCount = await Factory
                .CreateAsyncQueryble(queryProjects)
                .CountAsync();

            queryProjects = options.ApplySort(queryProjects);
            //queryProjects = options.ApplyPaging(queryProjects);

            return new ListResponse<ProjectResponse>
            {
                Items = await Factory
                    .CreateAsyncQueryble(queryProjects)
                    .ToListAsync(),
                Page = options.Page,
                PageSize = options.PageSize ?? totalCount,
                Sort = options.Sort,
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
