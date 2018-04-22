using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class CreateProjectCommand : ICreateProjectCommand
    {
        private IUnitOfWork Uow { get; }
        private IAsyncQueryableFactory Factory { get; }

        public CreateProjectCommand(IUnitOfWork uow, IAsyncQueryableFactory factory)
        {
            Uow = uow;
            Factory = factory;
        }

        public async Task<ProjectResponse> ExecuteAsync(string email, CreateProjectRequest request)
        {
            Project project = await Factory.CreateAsyncQueryble(Uow.ProjectsRepository.Query()
                    .Include(p => p.User)
                    .Select(p => p))
                .FirstOrDefaultAsync(p => p.Title == request.Title && p.User.Email == email);

            if (project != null) throw new CannotCreateProjectExists();

            User user = await Factory.CreateAsyncQueryble(Uow.UsersRepository.Query()
                    .Select(p => p))
                .FirstOrDefaultAsync(p => p.Email == email);

            var newProject = new Project
            {
                Title = request.Title,
                Description = request.Description,
                UserId = user.Id,
                InArchive = request.InArchive,
                User = user
            };

            Uow.ProjectsRepository.Add(newProject);
            await Uow.CommitAsync();

            return new ProjectResponse
            {
                Id = newProject.Id,
                Title = newProject.Title,
                Description = newProject.Description,
                InArchive = newProject.InArchive,
                OpenTasksCount = newProject.OpenTasksCount
            };
        }
    }
}
