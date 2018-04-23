using System.Collections.Generic;
using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public interface IGetChildrenTaskCommand
    {
        Task<IEnumerable<TaskResponse>> ExecuteAsync(int taskId);
    }
}
