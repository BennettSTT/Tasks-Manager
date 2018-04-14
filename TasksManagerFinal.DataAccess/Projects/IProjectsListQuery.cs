using System.Threading.Tasks;
using TasksManagerFinal.ViewModel;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.Projects
{
    public interface IProjectsListQuery
    {
        Task<ListResponse<ProjectResponse>> RunAsync(ProjectFilter filter, ListOptions options);
    }
}
