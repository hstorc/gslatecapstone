using Newtonsoft.Json;
using System.Web.Http;

namespace GreenSlate.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            var settings = GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
            //settings.ContractResolver = new pasca CamelCasePropertyNamesContractResolver();
            settings.Formatting = Formatting.Indented;

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                 // routeTemplate: "api/{controller}/{action}/{id}",
                routeTemplate: "api/{controller}/{id}",
                // defaults: new { action = "Index", id = RouteParameter.Optional }
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
