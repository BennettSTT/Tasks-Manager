using System;
using System.Linq;
using System.Linq.Expressions;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.DataAccess.UnitOfWork
{
    public interface IRepository<TEntity>
        where TEntity : DomainObject
    {
        IQueryable<TEntity> Query(params Expression<Func<TEntity, object>>[] includes);

        //IQueryable<TEntity> NoTrackingQuery(params Expression<Func<TEntity, object>>[] includes);

        void Add(TEntity entity);

        void Remove(TEntity entity);

        void Update(TEntity entity);

        void CountAsync(TEntity entity);
    }
}
