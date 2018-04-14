using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace TasksManagerFinal.DataAccess.UnitOfWork
{
    public interface IAsyncQueryable<TSourse>
    {
        Task<TSourse> FirstOrDefaultAsync();

        Task<TSourse> FirstOrDefaultAsync(Expression<Func<TSourse, bool>> predicate);

        Task<List<TSourse>> ToListAsync();

        Task<TSourse[]> ToArrayAsync();

        Task<int> CountAsync();
    }
}
