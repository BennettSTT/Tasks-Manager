using System.Linq;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
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

        public async Task<ListResponse<ProjectResponse>> RunAsync(ProjectFilter filter, ListOptions options)
        {
            var query = Uow.ProjectsRepository.Query()
                .Select(p => new ProjectResponse
                {
                    Id = p.Id,
                    Title = p.Title,
                    InArchive = p.InArchive,
                    Description = p.Description,
                    OpenTasksCount = p.Tasks.Count(t => t.Status != Entities.TaskStatus.Completed)
                });

            query = ApplyFilter(query, filter);
            int totalCount = await Factory
                .CreateAsyncQueryble(query)
                .CountAsync();

            if (options.Sort == null)
            {
                options.Sort = "Id";
            }

            query = options.ApplySort(query);
            query = options.ApplyPaging(query);

            return new ListResponse<ProjectResponse>
            {
                Items = await Factory
                    .CreateAsyncQueryble(query)
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
