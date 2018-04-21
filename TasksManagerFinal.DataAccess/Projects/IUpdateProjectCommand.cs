using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.Projects
{
    public interface IUpdateProjectCommand
    {
        Task<ProjectResponse> ExecuteAsunc(int projectId, UpdateProjectRequest request, string user);
    }
}
