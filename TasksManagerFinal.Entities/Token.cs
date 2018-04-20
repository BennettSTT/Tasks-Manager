using System;
using System.Collections.Generic;
using System.Text;

namespace TasksManagerFinal.Entities
{
    public class Token
    {
        public string accessToken { get; set; }
        public RefreshTokenObject refreshToken { get; set; }
        public string expiresIn { get; set; }
    }
}
