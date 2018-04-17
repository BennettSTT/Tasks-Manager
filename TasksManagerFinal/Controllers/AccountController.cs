﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.Controllers
{
    [Route("auth")]
    public class AccountController : Controller
    {
        public IUnitOfWork Uow { get; }

        public AccountController(IUnitOfWork uow)
        {
            Uow = uow;
        }

        [Authorize]
        [HttpGet("user-info/{userId}")]
        [ProducesResponseType(200, Type = typeof(UserInfoResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetUserAsync(int userId,
            [FromServices]IUserInfoQuery query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                UserInfoResponse user = await query.ExecuteAsync(userId);
                return Ok(user);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }
        }


        [HttpPost("token")]
        [ProducesResponseType(200, Type = typeof(GetTokenResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetTokenAsync([FromBody] GetTokenRequest getTokenRequest, 
            [FromServices]IGetJWTTokenCommand tokenCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GetTokenResponse identity;

            try
            {
                identity = await tokenCommand.ExecuteAsync(getTokenRequest);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }

            return Ok(identity);
        }


        [HttpPost("refresh-token")]
        [ProducesResponseType(200, Type = typeof(RefreshTokenResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RefreshTokenAsync([FromBody] RefreshTokenRequest tokenRequest, 
            [FromServices]IRefreshJWTTokenCommand tokenCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RefreshTokenResponse response;

            try
            {
                response = await tokenCommand.ExecuteAsync(tokenRequest);
            }
            catch (Exception e)
            {
                var errorJson = new
                {
                        message = e.Message
                };

                return StatusCode(401, JsonConvert.SerializeObject(errorJson));
            }

            return Ok(response);
        }


        [HttpPost("register")]
        [ProducesResponseType(200, Type = typeof(RegisterUserResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterUserRequest request,
            [FromServices]IRegisterUserCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RegisterUserResponse identity;

            try
            {
                identity = await command.ExecuteAsync(request);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }

            return Ok(identity);
        }
    }
}
