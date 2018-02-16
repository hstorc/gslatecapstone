namespace GreenSlate.Web.ServiceFactory
{
    public interface IServiceFactory<T> where T : class
    {
        T Build();
    }
}