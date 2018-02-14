using GreenSlate.Database.Model;
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

        public TodoService()
        {
            
        }

        public TodoService(IToDoDbContext db)
        {
            // this.db = db;
            this.db =db ;
        }
        public List<DtoToDoTask> GetToDoTasks(string userId)
        {
            return db.ToDoTasks.Where(t => t.CreatedFor == userId)
                .Select(v=>new DtoToDoTask
                {
                    Completed = v.Completed,
                    Title = v.Title,
                    Estimation = v.EstimatedHours,
                    CreatedByName = v.AspNetUser.Email
                }).ToList();
        }

        public DtoToDoTask GetDtoToDoTask(int id,string userId)
        {
            ToDoTask toDoTask = db.ToDoTasks.Find(id);
            if (toDoTask == null
                || toDoTask.Id == 0
                ||toDoTask.CreatedBy!=userId
                ||toDoTask.CreatedFor!=userId)
            {
                return null;
            }

            return new DtoToDoTask
            {
                CreatedFor = toDoTask.CreatedFor,
                CreatedByName = toDoTask.CreatedBy,
                Completed = toDoTask.Completed,
                Title = toDoTask.Title,
                Estimation = toDoTask.EstimatedHours
            };

        }

        public ToDoTask GetToDoTask(int id, string userId)
        {
            ToDoTask toDoTask = db.ToDoTasks.Find(id);
            if (toDoTask == null
                || toDoTask.Id == 0
                || toDoTask.CreatedBy != userId
                || toDoTask.CreatedFor != userId)
            {
                return null;
            }

            return toDoTask;

        }



        public HttpStatusCode PutToDoTask(int id, DtoToDoTask model,string userId)
        {
            ToDoTask toDoTask = GetToDoTask(id,userId);
            if (toDoTask==null||toDoTask.CreatedBy!=userId)
            {
                return HttpStatusCode.NotFound;
            }

            toDoTask.CreatedFor = model.CreatedFor;
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

            return HttpStatusCode.NoContent;

        }

        public HttpStatusCode PostToDoTask(DtoToDoTask model, string userId)
        {
            var createdfor = db.AspNetUsers.SingleOrDefault(u => u.Email.Equals(model.CreatedFor));

            if (createdfor == null)
            {
                return HttpStatusCode.NotFound;
            }

            ToDoTask toDoTask = new ToDoTask
            {
                CreatedBy = userId,
                CreatedTime = DateTime.Now,
                CreatedFor = createdfor.Id,
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
            ToDoTask toDoTask = GetToDoTask(id,userid);
            if (toDoTask == null)
            {
                return HttpStatusCode.NotFound;
            }

            if (toDoTask.CreatedBy != userid)
            {
                return HttpStatusCode.Forbidden;
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
            //throw new NotImplementedException();
        }

        public bool ToDoTaskExists(int id, string userid)
        {
            throw new NotImplementedException();
        }

        DtoToDoTask ITodoService.GetToDoTask(int id, string userid)
        {
            throw new NotImplementedException();
        }
    }
}