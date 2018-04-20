using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasksManagerFinal.DataAccess.Auth;
using TasksManagerFinal.ViewModel.Auth;

namespace TasksManagerFinal.Controllers
{
    [Route("api/users")]
    public class UsersController : Controller
    {
        [Authorize]
        [HttpGet("{userId}")]
        [ProducesResponseType(200, Type = typeof(UserInfoResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetUserAsync(int userId, [FromServices] IUserInfoQuery query)
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
    }
}
