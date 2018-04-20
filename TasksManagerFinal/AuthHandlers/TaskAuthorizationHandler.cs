using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System.Linq;
using System.Threading.Tasks;

namespace TasksManager.AuthHandlers
{
    //public class TaskAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Entities.Task>
    //{
        //protected override Task HandleRequirementAsync(
        //    AuthorizationHandlerContext context, 
        //    OperationAuthorizationRequirement requirement, 
        //    Entities.Task task)
        //{
        //    if (requirement.Name == Operations.Create.Name && context.User.Identity.Name == task?.Project.User.Login)
        //    {
        //        context.Succeed(requirement);
        //    }

        //    if (requirement.Name == Operations.Read.Name && 
        //        (context.User.IsInRole("user") || context.User.IsInRole("admin")))
        //    {
        //        context.Succeed(requirement);
        //    }

        //    if (requirement.Name == Operations.Update.Name && context.User.Identity.Name == task?.Project.User.Login)
        //    {
        //        context.Succeed(requirement);
        //    }

        //    if (requirement.Name == Operations.Delete.Name && 
        //        (context.User.Identity.Name == task?.Project.User.Login || context.User.IsInRole("admin")))
        //    {
        //        context.Succeed(requirement);
        //    }
        //    return Task.CompletedTask;
        //}
    //}
}
