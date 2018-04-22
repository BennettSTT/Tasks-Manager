namespace TasksManagerFinal.ViewModel.Projects
{
    public class ProjectFilter
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public bool? InArchive { get; set; }
        public RangeFilter<int> OpenTasksCount { get; set; }
    }
}
