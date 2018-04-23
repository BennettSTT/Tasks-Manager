using System;
using System.Collections.Generic;
using System.Text;

namespace TasksManagerFinal.DataAccess.Projects
{
    public class ProjectNotFound : Exception
    {
        public ProjectNotFound()
            : base("Project not found in database") { }
    }
}
