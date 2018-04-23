using Microsoft.Extensions.DependencyInjection;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.DbImplementation.Auth;
using TasksManagerFinal.DataAccess.DbImplementation.Projects;
using TasksManagerFinal.DataAccess.DbImplementation.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.Tasks;

namespace TasksManagerFinal.DataAccess.DbImplementation.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection RegisterUnitOfWorkDataAccess(this IServiceCollection service)
        {
            return service
                    .AddScoped<ICreateProjectCommand, CreateProjectCommand>()
                    .AddScoped<IProjectsListQuery, ProjectsListQuery>()
                    .AddScoped<IUpdateProjectCommand, UpdateProjectCommand>()
                    .AddScoped<IProjectQuery, ProjectQuery>()
                    .AddScoped<IGetProjectQuery, GetProjectQuery>()

                    .AddScoped<ILoginUserQuery, LoginUserQuery>()
                    .AddScoped<IRefreshTokenCommand, RefreshTokenCommand>()
                    .AddScoped<IUserInfoQuery, UserInfoQuery>()
                    
                    .AddScoped<ITaskListQuery, TaskListQuery>()
                    .AddScoped<ICreateTaskCommand, CreateTaskCommand>()
                    .AddScoped<IDeleteTaskCommand, DeleteTaskCommand>()
                    .AddScoped<IGetChildrenTaskCommand, GetChildrenTaskCommand>()
                    .AddScoped<IUpdateTaskCommand, UpdateTaskCommand>()

                    .AddScoped<ILoginUserQuery, LoginUserQuery>()
                    .AddScoped<IRegisterUserCommand, RegisterUserCommand>()
                ;
        }
    }
}
