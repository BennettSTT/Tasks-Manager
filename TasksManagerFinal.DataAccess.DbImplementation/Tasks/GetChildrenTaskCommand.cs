using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Services;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.DbImplementation.Tasks
{
    public class GetChildrenTaskCommand : IGetChildrenTaskCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public ITasksServices TasksServices { get; }

        public GetChildrenTaskCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, ITasksServices tasksServices)
        {
            Uow = uow;
            Factory = factory;
            TasksServices = tasksServices;
        }

        public async Task<IEnumerable<TaskResponse>> ExecuteAsync(int taskId)
        {
            var task = await Factory.CreateAsyncQueryble(Uow.TasksRepository.Query())
                .FirstOrDefaultAsync(t => t.Id == taskId);
            if (task == null) throw new TaskNotFound();

            return await TasksServices.GetChildren(taskId);
        }
    }
}
