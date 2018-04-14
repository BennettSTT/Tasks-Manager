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
        [ProducesResponseType(200, Type = typeof(AuthTokenResponce))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Token([FromBody] AuthRequest request, [FromServices]IAuthJWTCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            AuthTokenResponce identity;

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
