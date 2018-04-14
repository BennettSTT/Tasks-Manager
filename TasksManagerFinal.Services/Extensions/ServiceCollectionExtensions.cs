using Microsoft.Extensions.DependencyInjection;
using TasksManagerFinal.Services.UnitOfWork;

namespace TasksManagerFinal.Services.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection RegisterUnitOfWorkServices(this IServiceCollection services)
        {
            return services
                    .AddScoped<ITasksServices, GetTasksService>()
                ;
        }
    }
}
