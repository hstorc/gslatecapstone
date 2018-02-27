using GreenSlate.Business;
using GreenSlate.Web.Hubs;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace GreenSlate.Web.Controllers.Api
{
    public class ToDoTasksController : ApiController
    {
        private ITodoService todoService;
        Hubs.ToDoTasksHub todoHub;

        public ToDoTasksController()
        {

        }

        public ToDoTasksController(ITodoService service, ToDoTasksHub hub)
        {
            todoService = service;
            todoHub = hub;
        }

        // GET: api/DtoToDoTasks
        public IEnumerable<DtoToDoTask> GetDtoToDoTasks()
        {
            return todoService.GetToDoTasks();
        }

        // GET: api/DtoToDoTasks/5
        [ResponseType(typeof(DtoToDoTask))]
        public IHttpActionResult GetDtoToDoTask(int id)
        {
            DtoToDoTask dtoToDoTask = todoService.GetToDoTask(id,"");
            if (dtoToDoTask == null)
            {
                return NotFound();
            }

            return Ok(dtoToDoTask);
        }

        // PUT: api/DtoToDoTasks/5
        [HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDtoToDoTask(DtoToDoTask dtoToDoTask)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           /* if (id != dtoToDoTask.Id)
            {
                return BadRequest();
            }*/

            HttpStatusCode code= todoService.PutToDoTask(dtoToDoTask.Id.Value, dtoToDoTask, "");
            todoHub.SendUpdateTask(dtoToDoTask);
            return StatusCode(code);
        }

        // POST: api/DtoToDoTasks
        [ResponseType(typeof(DtoToDoTask))]
        public IHttpActionResult PostDtoToDoTask(DtoToDoTask dtoToDoTask)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            HttpStatusCode code = todoService.PostToDoTask(dtoToDoTask, "");
            todoHub.SendNewTask(dtoToDoTask);
            return CreatedAtRoute("DefaultApi", new { id = dtoToDoTask.Id }, dtoToDoTask);
        }

        // DELETE: api/DtoToDoTasks/5
        [ResponseType(typeof(DtoToDoTask))]
        public IHttpActionResult DeleteDtoToDoTask(int id)
        {
           /* DtoToDoTask dtoToDoTask = db.DtoToDoTasks.Find(id);
            if (dtoToDoTask == null)
            {
                return NotFound();
            }

            db.DtoToDoTasks.Remove(dtoToDoTask);
            db.SaveChanges();
            */
            return Ok(id);
        }

        protected override void Dispose(bool disposing)
        {            
            base.Dispose(disposing);
        }
       
    }
}