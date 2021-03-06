﻿using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace TasksManagerFinal.AuthHandlers
{
    public static class Operations
    {
        public static OperationAuthorizationRequirement Create =
            new OperationAuthorizationRequirement { Name = nameof(Create) };
        public static OperationAuthorizationRequirement Read =
            new OperationAuthorizationRequirement { Name = nameof(Read) };
        public static OperationAuthorizationRequirement Update =
            new OperationAuthorizationRequirement { Name = nameof(Update) };
        public static OperationAuthorizationRequirement Delete =
            new OperationAuthorizationRequirement { Name = nameof(Delete) };
        public static OperationAuthorizationRequirement CreateTask =
           new OperationAuthorizationRequirement { Name = nameof(CreateTask) };
    }
}
