using Microsoft.AspNet.SignalR;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using Unity;

namespace MsdrRu.Practices.Unity.SignalR
{
    public sealed class UnityDependencyResolver : DefaultDependencyResolver
    {
        private readonly Microsoft.Practices.Unity.IUnityContainer container;
        private global::Unity.IUnityContainer container1;

        public UnityDependencyResolver(Microsoft.Practices.Unity.IUnityContainer container)
        {
            this.container = container;
        }

        public UnityDependencyResolver(global::Unity.IUnityContainer container1)
        {
            this.container1 = container1;
        }

        public override object GetService(Type serviceType)
        {
            // ReSharper disable once ConvertIfStatementToReturnStatement
            if (container.IsRegistered(serviceType) || serviceType.IsSubclassOf(typeof(Hub)))
            {
                return container.Resolve(serviceType);
            }

            return base.GetService(serviceType);
        }

        public override IEnumerable<object> GetServices(Type serviceType)
        {
            // ReSharper disable once ConvertIfStatementToReturnStatement
            if (container.IsRegistered(serviceType))
            {
                return container.ResolveAll(serviceType);
            }

            return base.GetServices(serviceType);
        }
        
    }
}
