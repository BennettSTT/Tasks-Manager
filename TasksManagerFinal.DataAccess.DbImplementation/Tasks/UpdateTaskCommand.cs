using AutoMapper;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.DataAccess.DbImplementation.Tasks
{
    public class UpdateTaskCommand : IUpdateTaskCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IMapper Mapper { get; }

        public UpdateTaskCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, IMapper mapper)
        {
            Uow = uow;
            Factory = factory;
            Mapper = mapper;
        }

        public async Task<TaskResponse> ExecuteAsync(int taskId, UpdateTaskRequest request)
        {
            var task = await Factory.CreateAsyncQueryble(Uow.TasksRepository.Query())
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) throw new TaskNotFound();

            var upTask = Mapper.Map<UpdateTaskRequest, Entities.Task>(request, task);
            Uow.TasksRepository.Update(upTask);
            await Uow.CommitAsync();

            return Mapper.Map<Entities.Task, TaskResponse>(upTask);
        }
    }
}
