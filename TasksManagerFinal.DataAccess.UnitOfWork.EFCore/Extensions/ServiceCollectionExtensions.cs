using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TasksManagerFinal.Db;
using TasksManagerFinal.Services;
using TasksManagerFinal.Services.UnitOfWork;

namespace TasksManagerFinal.DataAccess.UnitOfWork.EFCore.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection RegisterUnitOfWorkEFCore(this IServiceCollection services,
            string connectionString)
        {
            return services
                    .AddDbContext<TasksContext>(options => options.UseSqlServer(connectionString))
                    .AddScoped<IUnitOfWork, EFCoreUnitOfWork>()
                    .AddTransient<IAsyncQueryableFactory, AsyncQueryableFactory>();
            ;
        }
    }
}
