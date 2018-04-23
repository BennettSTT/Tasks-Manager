using System.Collections.Generic;
using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.Tasks
{
    public interface ITaskListQuery
    {
        Task<IEnumerable<TaskResponse>> RunAsync(int projectId, int level);
    }
}
