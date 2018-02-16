using GreenSlate.Business;
using GreenSlate.Database.Model;

namespace GreenSlate.Web.ServiceFactory
{
    public class ToDoTaskFactory : IServiceFactory<TodoService>
    {
        private readonly IToDoDbContext context;

        public ToDoTaskFactory(IToDoDbContext context)
        {
            this.context = context;
        }

        public TodoService Build()
        {
            return TodoService.NewInstance(context);
        }
    }
}