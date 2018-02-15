using GreenSlate.Business;
using GreenSlate.Web.ViewModels;

namespace GreenSlate.Web.Helpers
{
    public static class Extension
    {
        public static ToDoViewModel ToTaskViewModel (this DtoToDoTask task)
        {
            return new ToDoViewModel
            {
                Id=task.Id,
                CreatedFor = task.CreatedFor,
                CreatedByName = task.CreatedBy,
                Estimation = task.Estimation,
                Completed = task.Completed,
                Title = task.Title
            };
        }

        public static DtoToDoTask ToDtoTask(this ToDoViewModel model)
        {
            return new DtoToDoTask
            {
                Id=model.Id,
                CreatedFor = model.CreatedFor,
                CreatedBy = model.CreatedByName,
                Estimation = model.Estimation,
                Completed = model.Completed,
                Title = model.Title
            };
        }

    }
}