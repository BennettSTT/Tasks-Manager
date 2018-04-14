using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.Db;
using TasksManagerFinal.Entities;

namespace TasksManagerFinal.DataAccess.UnitOfWork.EFCore
{
    internal class EFCoreUnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly TasksContext _context;

        private IRepository<Project> _projectRepository;
        private IRepository<Entities.Task> _taskRepository;
        private IRepository<User> _userRepository;

        public EFCoreUnitOfWork(TasksContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        #region Sync

        public int Commit()
        {
            return _context.SaveChanges();
        }

        #endregion

        #region Async

        public Task<int> CommitAsync()
        {
            return _context.SaveChangesAsync();
        }

        #endregion

        public void Migrate()
        {
            _context.Database.Migrate();
        }

        public IRepository<Project> ProjectsRepository =>
            _projectRepository ?? (_projectRepository = new EfCoreRepository<Project>(_context.Projects));

        public IRepository<Entities.Task> TasksRepository =>
            _taskRepository ?? (_taskRepository = new EfCoreRepository<Entities.Task>(_context.Tasks));

        public IRepository<User> UsersRepository =>
            _userRepository ?? (_userRepository = new EfCoreRepository<User>(_context.Users));

        #region Disposable implementation

        private bool disposed = false;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                _context.Dispose();
            }

            disposed = true;
        }

        #endregion
    }
}
