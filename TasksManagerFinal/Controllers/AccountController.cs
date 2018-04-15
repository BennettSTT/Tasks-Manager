using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.Controllers
{
    public class AccountController : Controller
    {
        public IUnitOfWork Uow { get; }

        public AccountController(IUnitOfWork uow)
        {
            Uow = uow;
        }

        [HttpPost("auth/token")]
        [ProducesResponseType(200, Type = typeof(GetTokenResponce))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetToken([FromBody] GetTokenRequest getTokenRequest, 
            [FromServices]IGetJWTTokenCommand tokenCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GetTokenResponce identity;

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


        [HttpPost("auth/refresh-token")]
        [ProducesResponseType(200, Type = typeof(RefreshTokenResponce))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest tokenRequest, 
            [FromServices]IRefreshJWTTokenCommand tokenCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RefreshTokenResponce responce;

            try
            {
                responce = await tokenCommand.ExecuteAsync(tokenRequest);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }

            return Ok(responce);
        }


        [HttpPost("auth/register")]
        [ProducesResponseType(200, Type = typeof(RegisterUserResponce))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request,
            [FromServices]IRegisterUserCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RegisterUserResponce identity;

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
