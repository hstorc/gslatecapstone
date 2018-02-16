using System.ComponentModel.DataAnnotations;

namespace GreenSlate.Business
{
    public class DtoToDoTask
    {
        public bool? Completed { get; set; }
        [Required]
        [MaxLength(100)]
        [MinLength(5)]
        public string Title { get; set; }
        public string CreatedFor { get; set; }
        [Required]
        [Range(1,128)]
        public short Estimation { get; set; }
        public string CreatedBy { get; set; }
        public int? Id { get; set; }
    }
}