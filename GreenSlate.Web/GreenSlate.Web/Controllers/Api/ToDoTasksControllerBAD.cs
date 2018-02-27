using GreenSlate.Business;
using GreenSlate.Web.Helpers;
using GreenSlate.Web.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace GreenSlate.Web.Controllers.Api
{

  //  [RoutePrefix("api/todotasks")]
    public class ToDoTasksControllerBAD : ApiController
    {
        //unity dependancy here!!


        private ITodoService todoService;
        Hubs.ToDoTasksHub todoHub;

        public ToDoTasksControllerBAD()
        {

        }

        public ToDoTasksControllerBAD(ITodoService service, Hubs.ToDoTasksHub hub)
        {
            todoService = service;
            todoHub = hub;
        }
        // GET: api/ToDoTasks
        [HttpGet]
      //  [Route]
        public List<ToDoViewModel> Index()
        {
            return todoService.GetToDoTasks().Select(t => t.ToTaskViewModel()).ToList();
        }

        // GET: api/ToDoTasks/5
        [HttpGet]
        [ResponseType(typeof(ToDoViewModel))]
     //   [Route]
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
        [HttpPut]
        // [ResponseType(typeof(void))]
        [ResponseType(typeof(ToDoViewModel))]
        //  public IHttpActionResult PutToDoTask(int id,[FromBody]ToDoViewModel model)
        public IHttpActionResult PutToDoTask(int id, string title, short estimation, bool completed)
        {
            string userId = "";// User.Identity.GetUserId();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ToDoViewModel model = new ToDoViewModel
            {
                Id = id,
                Title = title,
                Estimation = estimation,
                Completed = completed
            };
            todoHub.SendUpdateTask(model.ToDtoTask());
            return StatusCode(todoService.PutToDoTask(id, model.ToDtoTask(), userId));
        }

        // POST: api/ToDoTasks
        [HttpPost]
        [ResponseType(typeof(ToDoViewModel))]
       // [Route]
        public IHttpActionResult PostToDoTask(ToDoViewModel model)
        {
            HttpStatusCode code;

            string userId = "";// User.Identity.GetUserId();
            if (model.Id == 0)
            {
                code = todoService.PostToDoTask(model.ToDtoTask(), userId);
            }

            else
            {
                code = todoService.PutToDoTask(model.Id, model.ToDtoTask(), userId);
            }
            if (code == HttpStatusCode.OK)
            {
                todoHub.SendNewTask(model.ToDtoTask());
            }
            return StatusCode(code);
        }

        // DELETE: api/ToDoTasks/5
        [HttpDelete]
        [ResponseType(typeof(HttpStatusCode))]
        public IHttpActionResult DeleteToDoTask(int id)
        {
            string userId = "";// User.Identity.GetUserId();
            DtoToDoTask task = todoService.GetToDoTask(id, "");
            HttpStatusCode code = todoService.DeleteToDoTask(id, userId);
            if (code == HttpStatusCode.NoContent)
            {

                todoHub.SendDeleteTask(task);
            }
            return StatusCode(code);

        }

        /* [HttpGet]
         //[Route("getmodel")]        
         public IHttpActionResult GetModel()
         {          
             return this.Ok(new DtoToDoTask());
         }*/

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