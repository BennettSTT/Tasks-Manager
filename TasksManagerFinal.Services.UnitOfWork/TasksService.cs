using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.Services.UnitOfWork
{
    public class TasksService : ITasksServices
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IMapper Mapper { get; }

        public TasksService(IUnitOfWork uow, IAsyncQueryableFactory factory, IMapper mapper)
        {
            Uow = uow;
            Factory = factory;
            Mapper = mapper;
        }

        public async Task<IEnumerable<TaskResponse>> GetRoot(int projectId, int level)
        {
            var tasksObjects = await Factory.CreateAsyncQueryble(
                Uow.TasksRepository.Query()
                    .Select(p => p)
                    .Where(g => g.ProjectId == projectId && g.Level <= level)
            ).ToListAsync();
            var roots = tasksObjects.Where(g => g.Parent == null).ToList();
            var dict = tasksObjects
                .Where(g => g.Parent != null)
                .GroupBy(g => g.ParentId)
                .ToDictionary(group => group.Key.Value, group => group.ToList());

            var rootsResponse = new List<TaskResponse>();

            foreach (var root in roots)
            {
                root.Children = LoadChildren(dict, root.Id, level);
                rootsResponse.Add(Mapper.Map<Entities.Task, TaskResponse>(root));
            }

            return rootsResponse;
        }

        private ICollection<Entities.Task> LoadChildren(IDictionary<int, List<Entities.Task>> dict, int parentId, int level)
        {
            dict.TryGetValue(parentId, out var children);
            if (children == null) return null;
            if (level > 1)
            {
                foreach (var ch in children)
                {
                    ch.Children = LoadChildren(dict, ch.Id, level - 1);
                }
            }

            return children;
        }

        public async Task<IEnumerable<TaskResponse>> GetChildren(int parentId)
        {
            var query = Uow.TasksRepository.Query().Where(g => g.ParentId == parentId);
            var geoObject = await Factory.CreateAsyncQueryble(query).ToListAsync();
            var children = new List<TaskResponse>();
            foreach (var obj in geoObject)
            {
                children.Add(Mapper.Map<Entities.Task, TaskResponse>(obj));
            }

            return children;
        }

        public async Task<TaskResponse> AddNode(CreateTaskRequest request)
        {
            Entities.Task parent = null;
            if (request.ParentId != null)
            {
                 parent = await Factory.CreateAsyncQueryble(
                        Uow.TasksRepository.Query()
                            .Select(t => t)
                    )
                    .FirstOrDefaultAsync(p => p.Id == request.ParentId && p.ProjectId == request.ProjectId);
                if (parent == null)
                    throw new InvalidDataException("Task parent not found in database");

            }
            var task = Mapper.Map<CreateTaskRequest, Entities.Task>(request);
            
            // Если родителя нету - по умолчанию 0. Если есть, то Level родителя + 1
            if (parent != null) task.Level = parent.Level + 1;

            Uow.TasksRepository.Add(task);
            await Uow.CommitAsync();
            return Mapper.Map<Entities.Task, TaskResponse>(task);
        }

        public async Task Delete(int id)
        {
            await DeleteNode(id);
            await Uow.CommitAsync();
        }

        private async Task DeleteNode(int id)
        {
            var element = await Factory.CreateAsyncQueryble(Uow.TasksRepository.Query(c => c.Children))
                .FirstOrDefaultAsync(g => g.Id == id);
            foreach (var ch in element.Children)
            {
                await DeleteNode(ch.Id);
            }
            Uow.TasksRepository.Remove(element);
        }
    }
}
