using GreenSlate.Web.Models;
using GreenSlate.Web.ViewModels;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Security;

namespace GreenSlate.Web.Controllers.Api
{
    [Authorize]
    public class ToDoTasksController : ApiController
    {
        //unity dependancy here!!
        private ToDoByHayimEntities db = new ToDoByHayimEntities();

        // GET: api/ToDoTasks
        public IQueryable<ToDoTask> GetToDoTasks()
        {
            string userId = User.Identity.GetUserId();
            return db.ToDoTasks.Where(t=>t.CreatedFor==userId);
        }

        // GET: api/ToDoTasks/5
        [ResponseType(typeof(ToDoTask))]
        public IHttpActionResult GetToDoTask(int id)
        {
            ToDoTask toDoTask = db.ToDoTasks.Find(id);
            if (toDoTask == null)
            {
                return NotFound();
            }

            return Ok(toDoTask);
        }

        // PUT: api/ToDoTasks/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutToDoTask(int id, ToDoViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ToDoTask toDoTask = db.ToDoTasks.SingleOrDefault(t => t.Id == id);
            if (id != toDoTask.Id)
            {
                return NotFound();
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
                if (!ToDoTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ToDoTasks
        [ResponseType(typeof(ToDoTask))]
        public IHttpActionResult PostToDoTask(ToDoViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something is wrong");
            }

            string userId = User.Identity.GetUserId();
            var createdfor = db.AspNetUsers.SingleOrDefault(u => u.Email.Equals(model.CreatedFor));
            
            if (createdfor == null)
            {
                return BadRequest("Target user Not Found");
            }

            ToDoTask toDoTask = new ToDoTask
            {
                CreatedBy =userId,
                CreatedTime = DateTime.Now,
                CreatedFor = createdfor.Id,
                Title = model.Title,
                Completed = false,
                EstimatedHours = model.Estimation

            };
           
            db.ToDoTasks.Add(toDoTask);
            db.SaveChanges();

            return Ok();
        }

        // DELETE: api/ToDoTasks/5
        [ResponseType(typeof(ToDoTask))]
        public IHttpActionResult DeleteToDoTask(int id)
        {
            ToDoTask toDoTask = db.ToDoTasks.Find(id);
            if (toDoTask == null)
            {
                return NotFound();
            }

            db.ToDoTasks.Remove(toDoTask);
            db.SaveChanges();

            return Ok(toDoTask);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ToDoTaskExists(int id)
        {
            return db.ToDoTasks.Count(e => e.Id == id) > 0;
        }
    }
}