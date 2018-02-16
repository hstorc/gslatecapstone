using Microsoft.AspNet.SignalR;
using MsdrRu.Practices.Unity.SignalR;
using System.Web.Http;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(GreenSlate.Web.UnitySignalRActivator), nameof(GreenSlate.Web.UnitySignalRActivator.Start))]
[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(GreenSlate.Web.UnitySignalRActivator), nameof(GreenSlate.Web.UnitySignalRActivator.Shutdown))]

namespace GreenSlate.Web
{
    public static class UnitySignalRActivator
    {
        //    /// <summary>Integrates Unity when the application starts.</summary>
        public static HubConfiguration Start()
        {
            var resolver = new UnityDependencyResolver(UnityConfig.Container);

          /*  GlobalConfiguration.Configuration.DependencyResolver =
                new MsdrRu.Practices.Unity.SignalR.UnityDependencyResolver(UnityConfig.Container);*/

            GlobalConfiguration.Configuration.DependencyResolver = new Microsoft.AspNet.SignalR.DefaultDependencyResolver(UnityConfig.Container);
            // resolver = new UnityDependencyResolver(GreenSlate.Web.UnityConfig.Container);

            var config = new HubConfiguration { Resolver = resolver };

            return config;
        }

        public static void Shutdown()
        {
            UnityConfig.Container.Dispose();
        }
    }
}