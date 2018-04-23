using System.Threading.Tasks;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public interface IDeleteTaskCommand
    {
        Task ExecuteAsync(int taskId);
    }
}
