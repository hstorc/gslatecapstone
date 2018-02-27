using GreenSlate.Business;
using GreenSlate.Database;
using GreenSlate.Web.Hubs;
using Microsoft.AspNet.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(GreenSlate.Web.Startup))]

namespace GreenSlate.Web
{
    public partial class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            GlobalHost.DependencyResolver.Register(typeof(ToDoTasksHub),
               () => new ToDoTasksHub(
                   new TodoService(
                       new ToDoTaskDbContext())));
            //  GlobalHost.DependencyResolver.Register(typeof(ITodoService), () => new TodoService());
            //   GlobalHost.DependencyResolver.Register(typeof(IToDoDbContext), () => new ToDoTaskDbContext());

            app.MapSignalR(
                new HubConfiguration
                {
                    EnableJSONP = true,
                    EnableDetailedErrors = true,
                    EnableJavaScriptProxies = true

                });
        }
    }
}
