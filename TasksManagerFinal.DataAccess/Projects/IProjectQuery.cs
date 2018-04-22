using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.Projects
{
    public interface IProjectQuery
    {
        Task<ProjectResponse> ExecuteAsync(string login, string titleProject);
    }
}
