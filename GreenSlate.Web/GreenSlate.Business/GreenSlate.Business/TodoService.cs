using GreenSlate.Database.Model;
using Kendo.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;

//using GreenSlate.Web.Persistance;

namespace GreenSlate.Business
{
    public class TodoService : ITodoService, IDisposable
    {
        private IToDoDbContext db ;//= new ToDoByHayimEntities1();
     //   private TodoService service;
        public TodoService()
        {
            
        }

        public TodoService(IToDoDbContext db)
        {
            // this.db = db;
            this.db =db ;
        }

        public static TodoService NewInstance(IToDoDbContext context)
        {
            return new TodoService(context);
        }

        public List<DtoToDoTask> GetToDoTasks()
        {
            return db.ToDoTasks
                .Select(v=>new DtoToDoTask
                {
                    Id = v.Id,
                    Completed = v.Completed,
                    Title = v.Title,
                    Estimation = v.EstimatedHours,
                    CreatedBy = v.CreatedBy
                }).ToList();
        }

        public DtoToDoTask GetToDoTask(int id,string userId)
        {
            //ignoring userid- anybody can get
            ToDoTask toDoTask = GetTask(id,userId);
            if (toDoTask == null
                || toDoTask.Id == 0)
            {
                return null;
            }
            
            return new DtoToDoTask
            {
                Id=toDoTask.Id,
                CreatedFor = toDoTask.CreatedFor,
                CreatedBy = toDoTask.CreatedBy,
                Completed = toDoTask.Completed,
                Title = toDoTask.Title,
                Estimation = toDoTask.EstimatedHours
            };

        }

        public ToDoTask GetTask(int id, string userId)
        {
            //ignoring userid- anybody can get
            ToDoTask toDoTask = db.ToDoTasks.Find(id);
            if (toDoTask == null
                || toDoTask.Id == 0)
            {
                return null;
            }

            return toDoTask;

        }
        
        public HttpStatusCode PutToDoTask(int id, DtoToDoTask model,string userId)
        {
            //ignoring userid- anybody can get
            ToDoTask toDoTask = GetTask(id,userId);
            if (toDoTask==null)
            {
                return HttpStatusCode.NotFound;
            }

            //toDoTask.CreatedFor = model.CreatedFor;
            toDoTask.Title = model.Title;
            toDoTask.EstimatedHours = model.Estimation;
            toDoTask.Completed = model.Completed;
            
            db.Entry(toDoTask).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return HttpStatusCode.BadRequest;
            }

            return HttpStatusCode.OK;

        }

        public HttpStatusCode PostToDoTask(DtoToDoTask model, string userId)
        {           
            var users= db.AspNetUsers.ToList();
            Random random = new Random();
            int index = random.Next(0, users.Count);
            var createdby = users[index];

            if (createdby == null)
            {
                return HttpStatusCode.NotFound;
            }

            ToDoTask toDoTask = new ToDoTask
            {
                CreatedBy = createdby.Name,
                CreatedTime = DateTime.Now,
                Title = model.Title,
                Completed = false,
                EstimatedHours = model.Estimation

            };

            db.ToDoTasks.Add(toDoTask);
            db.SaveChanges();
            return HttpStatusCode.OK;
        }

        public HttpStatusCode DeleteToDoTask(int id,string userid)
        {
            //ignoring userid- anybody can delete
            ToDoTask toDoTask = GetTask(id,userid);
            if (toDoTask == null)
            {
                return HttpStatusCode.NotFound;
            }
           

            db.ToDoTasks.Remove(toDoTask);
            db.SaveChanges();
            return HttpStatusCode.NoContent;
        }

       /*public bool ToDoTaskExists(int id)
        {

            return GetToDoTask(id) == null ? false : true;
        }*/

        public void Dispose()
        {
            db = null;
        }

        public bool ToDoTaskExists(int id, string userid)
        {
            throw new NotImplementedException();
        }       

        public HttpStatusCode DeleteToDoTask(DtoToDoTask task, string userid)
        {
            return (DeleteToDoTask(task.Id.Value, ""));
            
            
        }

        public DataSourceResult GetTaskFiltered(DataSourceRequest request)
        {
            return db.ToDoTasks
                .Select(v => new DtoToDoTask
                {
                    Id = v.Id,
                    Completed = v.Completed,
                    Title = v.Title,
                    Estimation = v.EstimatedHours,
                    CreatedBy = v.CreatedBy
                }).ToDataSourceResult(request.Take,
                    request.Skip,
                    request.Sort,
                    request.Filter);
        }
    }
}