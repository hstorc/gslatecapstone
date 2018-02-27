using System.ComponentModel.DataAnnotations;

namespace GreenSlate.Web.ViewModels
{
    public class ToDoViewModel
    {
        public string CreatedFor { get; set; }
        [Required]
        [MinLength(4)]
        [MaxLength(20)]
        public string Title { get;  set; }
        [Required]
        [Range(0,100)]
        public short Estimation { get; set; }
        public bool? Completed { get; set; }
        public string CreatedByName { get; internal set; }
        public int Id { get; set; }
    }
}