using System.Linq;

namespace TasksManagerFinal.DataAccess.UnitOfWork
{
    public interface IAsyncQueryableFactory
    {
        IAsyncQueryable<T> CreateAsyncQueryble<T>(IQueryable<T> query);
    }
}
