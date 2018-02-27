using Kendo.DynamicLinq;
using System.Collections.Generic;
using System.Net;

namespace GreenSlate.Business
{
    public interface ITodoService
    {
        List<DtoToDoTask> GetToDoTasks();
        DtoToDoTask GetToDoTask(int id, string userid);
        HttpStatusCode PutToDoTask(int id, DtoToDoTask model, string userid);
        HttpStatusCode PostToDoTask(DtoToDoTask model, string userid);
        HttpStatusCode DeleteToDoTask(int id, string userid);
        HttpStatusCode DeleteToDoTask(DtoToDoTask task, string userid);
        bool ToDoTaskExists(int id, string userid);
        DataSourceResult GetTaskFiltered(DataSourceRequest request);
        void Dispose();
    }
}