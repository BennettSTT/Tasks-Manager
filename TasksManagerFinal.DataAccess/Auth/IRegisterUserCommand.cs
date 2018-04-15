﻿using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IRegisterUserCommand
    {
        Task<RegisterUserResponce> ExecuteAsync(RegisterUserRequest getTokenRequest);
    }
}
