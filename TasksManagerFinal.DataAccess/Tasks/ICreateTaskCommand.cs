using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public interface ICreateTaskCommand
    {
        Task<TaskResponse> ExecuteAsync(CreateTaskRequest response);
    }
}
