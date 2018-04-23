using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Services;

namespace TasksManagerFinal.DataAccess.DbImplementation.Tasks
{
    public class DeleteTaskCommand : IDeleteTaskCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public ITasksServices TasksServices { get; }

        public DeleteTaskCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, ITasksServices tasksServices)
        {
            Uow = uow;
            Factory = factory;
            TasksServices = tasksServices;
        }

        public async Task ExecuteAsync(int taskId)
        {
            var task = await Factory.CreateAsyncQueryble(Uow.TasksRepository.Query())
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) throw new CannotDeleteTaskNotFound();
            await TasksServices.Delete(taskId);
        }
    }
}
