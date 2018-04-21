using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using TasksManagerFinal.Entities;
using Task = System.Threading.Tasks.Task;

namespace TasksManagerFinal.AuthHandlers
{
    public class ProjectAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Project>
    {       
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, 
            OperationAuthorizationRequirement requirement, Project project)
        {
            if (requirement.Name == Operations.Update.Name && context.User.Identity.Name == project?.User.Email)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }  
    }   
}