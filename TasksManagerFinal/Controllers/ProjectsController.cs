using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.AuthHandlers;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.ViewModel;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.Controllers
{
    [Route("api/[controller]")]
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
        [HttpGet("{titleProject}")]
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
        [HttpPut("{projectId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateProjectAsync(int projectId, [FromBody] UpdateProjectRequest request,
            [FromServices] IUpdateProjectCommand command, [FromServices] IGetProjectQuery query)
        {
            try
            {
                var user = User.Identity.Name;
                var project = await query.ExecuteAsync(projectId);

                var authorizationResult = await AuthorizationService.AuthorizeAsync(User, project, Operations.Update);

                if (!authorizationResult.Succeeded) return StatusCode(403);
                var response = await command.ExecuteAsunc(projectId, request, user);
                return Ok(response);
            }
            catch (ProjectNotFound)
            {
                return NotFound();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
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
