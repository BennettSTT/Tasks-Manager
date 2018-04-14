using System.Linq;

namespace TasksManagerFinal.DataAccess.UnitOfWork.EFCore
{
    internal class AsyncQueryableFactory : IAsyncQueryableFactory
    {
        public IAsyncQueryable<T> CreateAsyncQueryble<T>(IQueryable<T> query)
        {
            return new AsyncQueryable<T>(query);
        }
    }
}
