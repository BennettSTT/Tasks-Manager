using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using TasksManagerFinal.Entities;
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
            CreateMap<Task, UpdateTaskRequest>();
            CreateMap<UpdateTaskRequest, Task>();
        }
    }
}
