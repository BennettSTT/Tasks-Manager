using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public interface IUpdateTaskCommand
    {
        Task<TaskResponse> ExecuteAsync(int taskId, UpdateTaskRequest request);
    }
}
