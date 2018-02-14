using System.Collections.Generic;
using GreenSlate.Web.ViewModels;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using GreenSlate.Business;
using GreenSlate.Database.Model;
using GreenSlate.Web.Helpers;

namespace GreenSlate.Web.Controllers.Api
{


    [Authorize]
    public class ToDoTasksController : ApiController
    {
        //unity dependancy here!!
       

        private ITodoService todoService;

        public ToDoTasksController()
        {
            
        }

        public ToDoTasksController(ITodoService service)
        {
            todoService = service;
        }
        // GET: api/ToDoTasks
        public List<ToDoViewModel> GetToDoTasks()
        {
            string userId = User.Identity.GetUserId();
            return todoService.GetToDoTasks(userId).Select(t => t.ToTaskViewModel()).ToList();
        }

        // GET: api/ToDoTasks/5
        [ResponseType(typeof(ToDoViewModel))]
        public IHttpActionResult GetToDoTask(int id)
        {
            string userId = User.Identity.GetUserId();
            DtoToDoTask toDoTask = todoService.GetToDoTask(id, userId);
            if (toDoTask == null)
            {
                return NotFound();
            }

            return Ok(toDoTask.ToTaskViewModel());
        }

        

        // PUT: api/ToDoTasks/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutToDoTask(int id, ToDoViewModel model)
        {
            string userId = User.Identity.GetUserId();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return StatusCode(todoService.PutToDoTask(id,model.ToDtoTask(),userId));
        }

        // POST: api/ToDoTasks
        [ResponseType(typeof(ToDoViewModel))]
        public IHttpActionResult PostToDoTask(ToDoViewModel model)
        {
            string userId = User.Identity.GetUserId();
            if (!ModelState.IsValid)
            {
                return BadRequest("Something is wrong");
            }

            HttpStatusCode code = todoService.PostToDoTask(model.ToDtoTask(), userId);
            
            return StatusCode(code);
        }

        // DELETE: api/ToDoTasks/5
        [ResponseType(typeof(ToDoTask))]
        public IHttpActionResult DeleteToDoTask(int id)
        {
            string userId = User.Identity.GetUserId();
            return StatusCode(todoService.DeleteToDoTask(id,userId));
            
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                todoService.Dispose();
            }
            base.Dispose(disposing);
        }
        
    }
}