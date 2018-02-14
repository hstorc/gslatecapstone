using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;

namespace GreenSlate.Database.Model
{
    public interface IToDoDbContext
    {
        DbSet<AspNetUser> AspNetUsers { get; set; }
        DbSet<ToDoTask> ToDoTasks { get; set; }
        int SaveChanges();
        IEnumerable<DbEntityValidationResult> GetValidationErrors();
        ToDoTask GetTaskById(int id);
        IEnumerable<ToDoTask> GetTasksPerUser(string id);
        bool DeleteTask(int id, string UserId);
        bool EditTask(string userId, ToDoTask model);
        bool AddTask(ToDoTask model);
        //object Entry(ToDoTask toDoTask);
        DbEntityEntry Entry(object entity);
    }
}