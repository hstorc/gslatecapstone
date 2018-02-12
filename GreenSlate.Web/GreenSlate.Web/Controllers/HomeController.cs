using System.Web.Mvc;
using Microsoft.AspNet.Identity;
namespace GreenSlate.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
      //todo: put the cache back  [OutputCache(Duration = 30, VaryByParam = "none")]
        public ActionResult Index()
        {
            var userid = User.Identity.GetUserId();
            return View();
        }
    }
}
