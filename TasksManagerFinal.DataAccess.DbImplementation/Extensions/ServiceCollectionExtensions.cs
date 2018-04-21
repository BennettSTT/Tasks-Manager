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
                    .AddScoped<IProjectQuery, ProjectQuery>()
                    .AddScoped<IGetProjectQuery, GetProjectQuery>()

                    .AddScoped<ILoginUserQuery, LoginUserQuery>()
                    .AddScoped<IRefreshTokenCommand, RefreshTokenCommand>()
                    .AddScoped<IUserInfoQuery, UserInfoQuery>()
                    
                    .AddScoped<ILoginUserQuery, LoginUserQuery>()
                    .AddScoped<IRegisterUserCommand, RegisterUserCommand>()
                ;
        }
    }
}
