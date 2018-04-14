using System.Threading.Tasks;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.DataAccess.UnitOfWork
{
    public interface IUnitOfWork
    {
        void Migrate();

        IRepository<Project> ProjectsRepository { get; }
        IRepository<Entities.Task> TasksRepository { get; }
        IRepository<User> UsersRepository { get; }

        #region Sync

        int Commit();

        #endregion

        #region Async

        Task<int> CommitAsync();

        #endregion
    }
}
