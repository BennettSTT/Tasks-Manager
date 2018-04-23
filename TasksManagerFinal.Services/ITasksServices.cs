using System.Collections.Generic;
using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.Services
{
    public interface ITasksServices
    {
        Task<IEnumerable<TaskResponse>> GetRoot(int projectId, int level);
        Task<IEnumerable<TaskResponse>> GetChildren(int parentId);
        Task<TaskResponse> AddNode(CreateTaskRequest request);
        Task Delete(int id);
    }
}
