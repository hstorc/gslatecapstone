using GreenSlate.Web.Models;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using GreenSlate.Database;

namespace GreenSlate.Web.Persistance
{
    public interface IDbToDoContext
    {
        DbSet<AspNetUser> AspNetUsers { get; set; }
        DbSet<ToDoTask> ToDoTasks { get; set; }
        int SaveChanges();
        //DbEntityEntry Entry(TEntity entity) where TEntity : ToDoTask;
        DbEntityEntry Entry(object entity);

    }
}
