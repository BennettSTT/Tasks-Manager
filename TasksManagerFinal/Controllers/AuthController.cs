using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public IUnitOfWork Uow { get; }

        public AuthController(IUnitOfWork uow)
        {
            Uow = uow;
        }

        [HttpPost("login")]
        [ProducesResponseType(200, Type = typeof(LoginUserResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetTokenAsync([FromBody] LoginUserRequest loginUserRequest,
            [FromServices] ILoginUserQuery tokenCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                LoginUserResponse identity = await tokenCommand.ExecuteAsync(loginUserRequest);
                return Ok(identity);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }
        }

        [HttpPost("refresh-token")]
        [ProducesResponseType(200, Type = typeof(RefreshTokenResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RefreshTokenAsync([FromBody] RefreshTokenRequest tokenRequest,
            [FromServices] IRefreshTokenCommand tokenCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var token = await tokenCommand.ExecuteAsync(tokenRequest);
                return Ok(token);
            }
            catch (Exception e)
            {
                return StatusCode(401, e.Message);
            }
        }

        [HttpPost("register")]
        [ProducesResponseType(200, Type = typeof(Token))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterUserRequest request,
            [FromServices] IRegisterUserCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Token token = await command.ExecuteAsync(request);
                return Ok(token);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }
        }
    }
}
