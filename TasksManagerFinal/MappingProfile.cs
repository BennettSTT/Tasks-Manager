using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using TasksManagerFinal.Entities;
using TasksManagerFinal.ViewModel.Auth;
using TasksManagerFinal.ViewModel.Projects;
using TasksManagerFinal.ViewModel.Tasks;

namespace TasksManagerFinal
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Task, TaskResponse>();
            CreateMap<CreateTaskRequest, Task>();

            CreateMap<Task, TaskResponse>();
                //.ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.GetName(typeof(TaskStatus), src.Status)));

            CreateMap<Task, UpdateTaskRequest>();
            CreateMap<UpdateTaskRequest, Task>();

            CreateMap<ProjectResponse, Project>();
            CreateMap<Project, ProjectResponse>();

            CreateMap<CreateProjectRequest, Project>();
            CreateMap<Project, CreateProjectRequest>();

            CreateMap<Token, LoginUserResponse>();
            CreateMap<Token, RefreshTokenResponse>();

            CreateMap<RegisterUserRequest, User>();
        }
    }
}
