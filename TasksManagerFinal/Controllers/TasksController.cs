using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.AuthHandlers;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.DataAccess.Tasks;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal.Controllers
{
    [Route("api/[controller]")]
    public class TasksController : Controller
    {
        public IAuthorizationService AuthorizationService { get; }

        public TasksController(IAuthorizationService authorizationService)
        {
            AuthorizationService = authorizationService;
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> GetTasksAsync(string login, string title, int level, 
            [FromServices] ITaskListQuery query)
        {
            try
            {
                var authorizationResult =
                    await AuthorizationService.AuthorizeAsync(User, new Entities.Task(), Operations.Read);
                if (!authorizationResult.Succeeded) return StatusCode(403);

                var response = await query.RunAsync(login, title, level);
                if (response == null) return NotFound();
                return Ok(response);
            }
            catch (ProjectNotFound e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> CreateTaskAsync([FromBody] CreateTaskRequest request,
            [FromServices] ICreateTaskCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var authorizationResult = 
                    await AuthorizationService.AuthorizeAsync(User, new Entities.Task(), Operations.Create);
                if (!authorizationResult.Succeeded) return StatusCode(403);

                var response = await command.ExecuteAsync(request);
                return StatusCode(201, response);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpDelete("{taskId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> DeleteTaskAsync(int taskId, [FromServices] IDeleteTaskCommand command)
        {
            try
            {
                // TODO: Разрешать ли удаление НЕ владельцу таска? 
                var authorizationResult =
                    await AuthorizationService.AuthorizeAsync(User, new Entities.Task(), Operations.Delete);
                if (!authorizationResult.Succeeded) return StatusCode(403);

                await command.ExecuteAsync(taskId);
                return StatusCode(204);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpGet("{taskId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetChildrenTaskAsync(int taskId, [FromServices] IGetChildrenTaskCommand command)
        {
            try
            {
                var authorizationResult =
                    await AuthorizationService.AuthorizeAsync(User, new Entities.Task(), Operations.Read);
                if (!authorizationResult.Succeeded) return StatusCode(403);

                var response = await command.ExecuteAsync(taskId);
                return Ok(response);
            }
            catch (TaskNotFound e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpPut("{taskId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateTaskAsync(int taskId, [FromBody] UpdateTaskRequest request,
            [FromServices] IUpdateTaskCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var authorizationResult =
                    await AuthorizationService.AuthorizeAsync(User, new Entities.Task(), Operations.Update);
                if (!authorizationResult.Succeeded) return StatusCode(403);

                var response = await command.ExecuteAsync(taskId, request);
                return Ok(response);
            }
            catch (TaskNotFound e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}
