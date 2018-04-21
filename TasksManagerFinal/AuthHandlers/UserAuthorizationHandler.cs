using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using TasksManagerFinal.Entities;
using Task = System.Threading.Tasks.Task;

namespace TasksManagerFinal.AuthHandlers
{
    public class UserAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, User>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            User user)
        {

            if (requirement.Name == Operations.Read.Name && context.User.Identity.Name == user.Email)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
