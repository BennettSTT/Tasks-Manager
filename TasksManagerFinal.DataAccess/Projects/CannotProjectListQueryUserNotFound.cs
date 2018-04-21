using System;

namespace TasksManagerFinal.DataAccess.Projects
{
    public class CannotUpdateProjectNotFound : Exception
    {
        public CannotUpdateProjectNotFound()
            : base("Cannot query list project: User not found in database") { }
    }
}
