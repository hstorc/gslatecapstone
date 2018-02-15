﻿namespace GreenSlate.Business
{
    public class DtoToDoTask
    {
        public bool? Completed { get; set; }
        public string Title { get; set; }
        public string CreatedFor { get; set; }
        public short Estimation { get; set; }
        public string CreatedBy { get; set; }
        public int Id { get; set; }
    }
}