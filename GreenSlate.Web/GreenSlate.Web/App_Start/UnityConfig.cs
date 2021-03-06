using GreenSlate.Business;
using GreenSlate.Database.Model;
using GreenSlate.Web.Controllers;
using GreenSlate.Web.Hubs;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using Unity;
//using GreenSlate.Web.Persistance;
using Unity.Injection;
using Unity.Lifetime;

namespace GreenSlate.Web
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public static class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container =
          new Lazy<IUnityContainer>(() =>
          {
              var container = new UnityContainer();
              RegisterTypes(container);
              return container;
          });

        /// <summary>
        /// Configured Unity Container.
        /// </summary>
        public static IUnityContainer Container => container.Value;
        #endregion

        /// <summary>
        /// Registers the type mappings with the Unity container.
        /// </summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>
        /// There is no need to register concrete types such as controllers or
        /// API controllers (unless you want to change the defaults), as Unity
        /// allows resolving a concrete type even if it was not previously
        /// registered.
        /// </remarks>
        public static void RegisterTypes(Unity.IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
            container.RegisterType<IHubActivator, UnityHubActivator>(new ContainerControlledLifetimeManager());
            container.RegisterType<ITodoService, TodoService>(new PerResolveLifetimeManager());
            container.RegisterType<IToDoDbContext, GreenSlate.Database.ToDoTaskDbContext>(new PerResolveLifetimeManager());
            container.RegisterType<IToDoTasksHub, ToDoTasksHub>(new PerResolveLifetimeManager());

           // container.RegisterType<AccountController>(new InjectionConstructor());
           // container.RegisterType<ManageController>(new InjectionConstructor());


        }
    }
}