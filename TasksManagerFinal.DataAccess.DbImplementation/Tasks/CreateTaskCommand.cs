using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.DbImplementation.Tasks
{
    public class CreateTaskCommand : ICreateTaskCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public ITasksServices TasksServices { get; }

        public CreateTaskCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, ITasksServices tasksServices)
        {
            Uow = uow;
            Factory = factory;
            TasksServices = tasksServices;
        }

        public async Task<TaskResponse> ExecuteAsync(CreateTaskRequest response)
        {
            return await TasksServices.AddNode(response);
        }
    }
}
