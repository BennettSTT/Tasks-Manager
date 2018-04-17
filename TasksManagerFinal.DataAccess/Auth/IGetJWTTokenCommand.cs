﻿using System.Threading.Tasks;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.DataAccess.Auth
{
    public interface IGetJWTTokenCommand
    {
        Task<GetTokenResponse> ExecuteAsync(GetTokenRequest getTokenRequest);
    }
}
