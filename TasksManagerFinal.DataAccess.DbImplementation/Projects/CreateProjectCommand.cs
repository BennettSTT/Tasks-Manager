using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.DataAccess.Users;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.DataAccess.DbImplementation.Projects
{
    public class CreateProjectCommand : ICreateProjectCommand
    {
        public IUnitOfWork Uow { get; }
        public IAsyncQueryableFactory Factory { get; }
        public IMapper Mapper { get; }

        public CreateProjectCommand(IUnitOfWork uow, IAsyncQueryableFactory factory, IMapper mapper)
        {
            Uow = uow;
            Factory = factory;
            Mapper = mapper;
        }

        public async Task<ProjectResponse> ExecuteAsync(string email, CreateProjectRequest request)
        {

            User user = await Factory.CreateAsyncQueryble(Uow.UsersRepository.Query())
                .FirstOrDefaultAsync(p => p.Email == email);
            if (user == null) throw new UsersNotFound();

            Project project = await Factory.CreateAsyncQueryble(Uow.ProjectsRepository.Query()
                    .Include(p => p.User)
                    .Select(p => p))
                .FirstOrDefaultAsync(p => p.Title == request.Title && p.User.Email == email);
            if (project != null) throw new CannotCreateProjectExists();

            Project newProj = Mapper.Map<CreateProjectRequest, Project>(request);
            newProj.UserId = user.Id;
            newProj.User = user;

            Uow.ProjectsRepository.Add(newProj);
            await Uow.CommitAsync();

            return Mapper.Map<Project, ProjectResponse>(newProj);
        }
    }
}
