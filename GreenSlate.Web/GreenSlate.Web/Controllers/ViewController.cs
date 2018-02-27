using GreenSlate.Web.ViewModels;
using System.Web.Mvc;
using System.Web.SessionState;

namespace GreenSlate.Web.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ViewController : Controller
    {
        [HttpGet]
      //  [OutputCache(Duration = int.MaxValue, VaryByParam = "*", Location = OutputCacheLocation.Downstream)]
        public ActionResult GetView(string viewName)
        {
            var viewRelativePath = string.Format("~/SPA/Views/{0}.cshtml", viewName);

            var viewServerPath = this.Server.MapPath(viewRelativePath);

            if (!System.IO.File.Exists(viewServerPath))
            {
                // File doesn't exist. Return something which will be informative.
                viewRelativePath = string.Format("~/Spa/Views/{0}.cshtml", "errorhandler/viewnotfound");
            }

            return this.View(viewRelativePath);
        }

        public ActionResult Create() {
            return View("../Home/Create");
        }

        [HttpPost]
        public ActionResult Create(ToDoViewModel model) {
            model.Completed = true;
            return View("../Home/Create",model);
        }        

    }
}