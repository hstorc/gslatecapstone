using GreenSlate.Business;

namespace GreenSlate.Web.Hubs
{
    public interface IToDoTasksHub
    {
        void SendDeleteTask(DtoToDoTask task);
        void SendNewTask(DtoToDoTask task);
        void SendUpdateTask(DtoToDoTask task);
    }
}