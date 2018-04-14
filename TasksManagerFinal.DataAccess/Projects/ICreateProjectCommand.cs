using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.Projects
{
    public interface ICreateProjectCommand
    {
        Task<ProjectResponse> ExecuteAsync(CreateProjectRequest request);
    }
}
