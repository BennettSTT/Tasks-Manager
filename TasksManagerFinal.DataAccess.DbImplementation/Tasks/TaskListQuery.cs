using System.Collections.Generic;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.DbImplementation.Tasks
{
    public class TaskListQuery : ITaskListQuery
    {
        public ITasksServices TasksServices { get; }

        public TaskListQuery(ITasksServices tasksServices)
        {
            TasksServices = tasksServices;
        }

        public async Task<IEnumerable<TaskResponse>> RunAsync(int projectId, int level)
        {
            return await TasksServices.GetRoot(projectId, level);
        }
    }
}
