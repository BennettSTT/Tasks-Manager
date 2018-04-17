using Microsoft.Extensions.DependencyInjection;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.DbImplementation.Auth;
using TasksManagerFinal.DataAccess.DbImplementation.Projects;
using TasksManagerFinal.DataAccess.Projects;

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

                    .AddScoped<IGetJWTTokenCommand, GetJWTTokenCommand>()
                    .AddScoped<IRefreshJWTTokenCommand, RefreshJWTTokenCommand>()
                    .AddScoped<IUserInfoQuery, UserInfoQuery>()

                    .AddScoped<IRegisterUserCommand, RegisterUserCommand>()
                ;
        }
    }
}
