using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasksManagerFinal.AuthHandlers;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        public IAuthorizationService AuthorizationService { get; }

        public UsersController(IAuthorizationService authorizationService)
        {
            AuthorizationService = authorizationService;
        }

        [Authorize]
        [HttpGet("{userId}")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(403)]
        public async Task<IActionResult> GetUserAsync(int userId, [FromServices] IUserInfoQuery query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await query.ExecuteAsync(userId);

                var authorizationResult = await AuthorizationService.AuthorizeAsync(User, user, Operations.Read);
                if (!authorizationResult.Succeeded) return StatusCode(403);
                return Ok(user);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}
