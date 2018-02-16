using GreenSlate.Business;
using GreenSlate.Database;
using GreenSlate.Database.Model;
using GreenSlate.Web.ServiceFactory;
using System.Collections.Generic;

namespace GreenSlate.Web.Hubs
{
    // [HubName("ToDoTasksHub")]
    public class ToDoTasksHub : Microsoft.AspNet.SignalR.Hub
    {
        private ITodoService service;
        
        public ToDoTasksHub(ITodoService service)
        {
            this.service = service;
        }

        public ToDoTasksHub()
        {
            IToDoDbContext context = new ToDoTaskDbContext();
            ToDoTaskFactory factory = new ToDoTaskFactory(context);
            service = factory.Build();
        }
        public IEnumerable<DtoToDoTask> Read()
        {
            var ret = service.GetToDoTasks();
            return ret;
        }

        public void Update(DtoToDoTask entity)
        {
            // validation
            // commit changes to database
            service.PutToDoTask(entity.Id.Value, entity,"");
            Clients.Others.update(entity);
        }
        
        public DtoToDoTask Create(DtoToDoTask entity)
        {
            // validation
            // commit changes to database
            service.PostToDoTask(entity, "");
            if (entity.Id > 0)
            {
                Clients.Others.update(entity);
            }
            else
            {
                Clients.Others.create(entity);
            }

            return entity;
        }

        public void Destroy(DtoToDoTask entity)
        {
            // validation
            // commit changes to database
            service.DeleteToDoTask(entity.Id.Value, "");
            Clients.Others.destroy(entity);
        }
       
    }
}