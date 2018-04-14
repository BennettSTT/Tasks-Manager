namespace TasksManagerFinal.ViewModel.Projects
{
    public class ProjectResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool InArchive { get; set; }
        public int? OpenTasksCount { get; set; }
    }
}
