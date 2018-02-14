using System.Collections.Generic;
using GreenSlate.Database.Model;
using System.Linq;
using System.Net;

namespace GreenSlate.Business
{
    public interface ITodoService
    {
        List<DtoToDoTask> GetToDoTasks(string userId);
        DtoToDoTask GetToDoTask(int id, string userid);
        HttpStatusCode PutToDoTask(int id, DtoToDoTask model, string userid);
        HttpStatusCode PostToDoTask(DtoToDoTask model, string userid);
        HttpStatusCode DeleteToDoTask(int id, string userid);
        bool ToDoTaskExists(int id, string userid);
        void Dispose();
    }
}