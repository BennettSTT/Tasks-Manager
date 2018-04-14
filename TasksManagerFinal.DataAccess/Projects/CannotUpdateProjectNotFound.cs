using System;

namespace TasksManagerFinal.DataAccess.Projects
{
    public class CannotUpdateProjectNotFound : Exception
    {
        public CannotUpdateProjectNotFound()
            : base("Cannot update project: Project not found in database") { }
    }
}
