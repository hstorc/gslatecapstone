namespace DbLayer
{
    public class DtoToDoTask
    {
        public bool? Completed { get; set; }
        public string Title { get; set; }
        public string CreatedFor { get; set; }
        public short Estimation { get; set; }
        public string CreatedByName { get; set; }
    }
}