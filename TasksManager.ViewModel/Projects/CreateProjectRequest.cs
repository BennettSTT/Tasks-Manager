using System.ComponentModel.DataAnnotations;

namespace TasksManagerFinal.ViewModel.Projects
{
    public class CreateProjectRequest
    {
        public CreateProjectRequest()
        {
            InArchive = false;
        }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [MaxLength(2000)]
        public string Description { get; set; }

        public bool InArchive { get; set; }
    }
}
