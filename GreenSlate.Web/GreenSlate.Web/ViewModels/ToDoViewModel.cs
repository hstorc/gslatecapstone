namespace GreenSlate.Web.ViewModels
{
    public class ToDoViewModel
    {
        public string CreatedFor { get; set; }
        public string Title { get;  set; }
        public short Estimation { get; set; }
        public bool? Completed { get; set; }
    }
}