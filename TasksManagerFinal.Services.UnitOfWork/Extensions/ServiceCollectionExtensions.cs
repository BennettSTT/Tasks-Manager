using Microsoft.Extensions.DependencyInjection;

namespace TasksManagerFinal.Services.UnitOfWork.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection RegisterServicesUnitOfWork(this IServiceCollection services)
        {
            return services
                    .AddScoped<ITasksServices, GetTasksService>()
                    .AddScoped<IAuthJWTTokenServices, AuthJWTTokenServices>()
                ;
        }
    }
}
