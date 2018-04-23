using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Task = System.Threading.Tasks.Task;

namespace TasksManagerFinal.AuthHandlers
{
    public class TaskAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Entities.Task>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            Entities.Task task)
        {

            if (requirement.Name == Operations.Read.Name)
            {
                context.Succeed(requirement);
            }

            if (requirement.Name == Operations.Create.Name)
            {
                context.Succeed(requirement);
            }

            if (requirement.Name == Operations.Delete.Name)
            {
                context.Succeed(requirement);
            }

            if (requirement.Name == Operations.Update.Name)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
