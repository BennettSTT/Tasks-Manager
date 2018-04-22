using System;

namespace TasksManagerFinal.DataAccess.Projects
{
    public class CannotCreateProjectExists : Exception
    {
        public CannotCreateProjectExists()
            : base("Cannot create project: Project with this name already exists in database") { }
    }
}
