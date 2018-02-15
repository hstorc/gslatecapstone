using GreenSlate.Business;
using GreenSlate.Database.Model;
using GreenSlate.Web.Helpers;
using GreenSlate.Web.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace GreenSlate.Web.Controllers.Api
{

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
       // [HttpGet]
        public List<ToDoViewModel> GetToDoTasks()
        {
            return todoService.GetToDoTasks().Select(t => t.ToTaskViewModel()).ToList();
        }

        // GET: api/ToDoTasks/5
        [ResponseType(typeof(ToDoViewModel))]
        public IHttpActionResult GetToDoTask(int id)
        {
            string userId = "";// User.Identity.GetUserId();
            DtoToDoTask toDoTask = todoService.GetToDoTask(id, userId);
            if (toDoTask == null)
            {
                return NotFound();
            }

            return Ok(toDoTask.ToTaskViewModel());
        }



        // PUT: api/ToDoTasks/5
       // [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutToDoTask(int id, ToDoViewModel model)
        {
            string userId = "";// User.Identity.GetUserId();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return StatusCode(todoService.PutToDoTask(id, model.ToDtoTask(), userId));
        }

        // POST: api/ToDoTasks
        //[HttpPost]
        [ResponseType(typeof(ToDoViewModel))]
        public IHttpActionResult PostToDoTask(ToDoViewModel model)
        {
            HttpStatusCode code;
            string userId = "";// User.Identity.GetUserId();
            if (model.Id==0)
            {
                 code = todoService.PostToDoTask(model.ToDtoTask(), userId);
            }

            else
            {
                 code = todoService.PutToDoTask(model.Id, model.ToDtoTask(), userId);
            }

            return StatusCode(code);
        }

        // DELETE: api/ToDoTasks/5
       // [HttpDelete]
        [ResponseType(typeof(ToDoTask))]
        public IHttpActionResult DeleteToDoTask(int id)
        {
            string userId = "";// User.Identity.GetUserId();
            return StatusCode(todoService.DeleteToDoTask(id, userId));

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