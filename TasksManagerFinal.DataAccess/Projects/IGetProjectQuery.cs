using System.Threading.Tasks;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.DataAccess.Projects
{
    public interface IGetProjectQuery
    {
        Task<Project> ExecuteAsync(int projectId);
    }
}
