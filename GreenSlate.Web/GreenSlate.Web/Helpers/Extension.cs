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
                CreatedFor = task.CreatedFor,
                CreatedByName = task.CreatedByName,
                Estimation = task.Estimation,
                Completed = task.Completed,
                Title = task.Title
            };
        }

        public static DtoToDoTask ToDtoTask(this ToDoViewModel model)
        {
            return new DtoToDoTask
            {
                CreatedFor = model.CreatedFor,
                CreatedByName = model.CreatedByName,
                Estimation = model.Estimation,
                Completed = model.Completed,
                Title = model.Title
            };
        }

    }
}