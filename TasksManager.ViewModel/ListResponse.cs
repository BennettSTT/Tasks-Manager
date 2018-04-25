using System.Collections.Generic;

namespace TasksManagerFinal.ViewModel
{
    public class ListResponse<TItem> where TItem : class
    {
        public ICollection<TItem> Items { get; set; }
        public int TotalItemsCount { get; set; }
    }
}
