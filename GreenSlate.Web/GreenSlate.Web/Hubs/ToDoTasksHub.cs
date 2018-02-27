using GreenSlate.Business;
using Kendo.DynamicLinq;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;

namespace GreenSlate.Web.Hubs
{
    // [HubName("ToDoTasksHub")]
    public class ToDoTasksHub : Microsoft.AspNet.SignalR.Hub, IToDoTasksHub
    {
        private ITodoService service;

        public ToDoTasksHub(ITodoService service)
        {
            this.service = service;
        }

        public ToDoTasksHub() { }

        public DataSourceResult Data(DataSourceRequest request)
        {
            if (request.Take == 0)
            {
                request.Take = 1000;
            }
           // request.Filter.Filterde
            var ret = service.GetTaskFiltered(request);
            return ret;
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
            service.PutToDoTask(entity.Id.Value, entity, "");
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

        //Specific User Call  
        public void SendNewTask(DtoToDoTask task)
        {
            try
            {
                var context = GlobalHost.ConnectionManager.GetHubContext<ToDoTasksHub>();
                context.Clients.All.create(task);
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }

        public void SendUpdateTask(DtoToDoTask task)
        {
            try
            {
                var context = GlobalHost.ConnectionManager.GetHubContext<ToDoTasksHub>();
                context.Clients.All.update(task);
                context.Clients.All.Invoke("Update", new DataSourceResult
                {
                    Data = new[] { task }
                });
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }

        public void SendDeleteTask(DtoToDoTask task)
        {
            try
            {
                var context = GlobalHost.ConnectionManager.GetHubContext<ToDoTasksHub>();
                context.Clients.All.destroy(task);
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }

    }
}