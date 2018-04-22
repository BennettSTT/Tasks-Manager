using System;
using System.Collections.Generic;
using System.Text;

namespace TasksManagerFinal.DataAccess.Users
{
    public class UsersNotFound : Exception
    {
        public UsersNotFound()
            : base("User not found in database") { }
    }
}
