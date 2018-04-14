using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TasksManagerFinal.DataAccess.Projects;
using TasksManagerFinal.ViewModel;
using TasksManagerFinal.ViewModel.Projects;

namespace TasksManagerFinal.Controllers
{
    [Route("api/[controller]")]
    public class ProjectsController : Controller
    {
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(ListResponse<ProjectResponse>))]
        public async Task<IActionResult> GetProjectsListAsync(
            ProjectFilter filter, ListOptions options, [FromServices] IProjectsListQuery query)
        {
            var response = await query.RunAsync(filter, options);
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(201, Type = typeof(ProjectResponse))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateProjectAsync([FromBody] CreateProjectRequest request,
            [FromServices] ICreateProjectCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ProjectResponse response;
            try
            {
                response = await command.ExecuteAsync(request);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }

            return StatusCode(201, response);
        }

        [HttpPut("{projectId}")]
        [ProducesResponseType(200, Type = typeof(ProjectResponse))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateProjectAsync(int projectId, [FromBody] UpdateProjectRequest request,
            [FromServices] IUpdateProjectCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ProjectResponse response;
            try
            {
                response = await command.ExecuteAsunc(projectId, request);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }

            return Ok(response);
        }
    }
}
