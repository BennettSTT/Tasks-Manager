using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace TasksManagerFinal.DataAccess.UnitOfWork.EFCore
{
    internal class AsyncQueryable<T> 
        : IAsyncQueryable<T>
    {
        private readonly IQueryable<T> _query;

        public AsyncQueryable(IQueryable<T> query)
        {
            _query = query;
        }

        public Task<T> FirstOrDefaultAsync()
        {
            return _query.FirstOrDefaultAsync();
        }

        public Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return _query.FirstOrDefaultAsync(predicate);
        }

        public Task<List<T>> ToListAsync()
        {
            return _query.ToListAsync();
        }

        public Task<T[]> ToArrayAsync()
        {
            return _query.ToArrayAsync();
        }

        public Task<int> CountAsync()
        {
            return _query.CountAsync();
        }
    }
}
