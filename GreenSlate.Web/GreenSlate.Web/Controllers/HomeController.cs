using System.Web.Mvc;
namespace GreenSlate.Web.Controllers
{
    public class HomeController : Controller
    {
        [OutputCache(Duration = 30, VaryByParam = "none")]
        public ActionResult Index()
        {
            return View();
        }        
    }
}
