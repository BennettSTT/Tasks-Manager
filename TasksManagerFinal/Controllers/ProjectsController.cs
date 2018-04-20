using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.ViewModel;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.Controllers
{
    [Route("api")]
    public class ProjectsController : Controller
    {
        public IAuthorizationService AuthorizationService { get; }

        public ProjectsController(IAuthorizationService authorizationService)
        {
            AuthorizationService = authorizationService;
        }

        [Authorize]
        [HttpGet("{login}")]
        [ProducesResponseType(200, Type = typeof(ListResponse<ProjectResponse>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetProjectListAsync(string login, ProjectFilter filter,
            ListOptions options, [FromServices] IProjectsListQuery query)
        {
            try
            {
                var response = await query.RunAsync(login, filter, options);
                return Ok(response);
            }
            catch (CannotUpdateProjectNotFound error)
            {
                return NotFound(error.Message);
            }
            catch (Exception error)
            {
                return StatusCode(400, error.Message);
            }
        }

        [Authorize]
        [HttpGet("{userLogin}/{titleProject}")]
        [ProducesResponseType(200, Type = typeof(ListResponse<ProjectResponse>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetProjectAsync(string userLogin, string titleProject,
            [FromServices] IProjectQuery query)
        {
            try
            {
                var response = await query.ExecuteAsync(userLogin, titleProject);
                return Ok(response);
            }
            catch (Exception error)
            {
                return StatusCode(400, error.Message);
            }
        }

        [Authorize]
        [HttpPost("new")]
        [ProducesResponseType(201, Type = typeof(ProjectResponse))]
        [ProducesResponseType(401)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateProjectAsync([FromBody] CreateProjectRequest request,
            [FromServices] ICreateProjectCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            string email = User.Identity.Name;
            try
            {
                ProjectResponse project = await command.ExecuteAsync(email, request);
                return StatusCode(201, project);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }
        }
    }
}
