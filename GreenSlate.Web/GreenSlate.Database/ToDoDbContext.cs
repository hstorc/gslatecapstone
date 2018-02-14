using GreenSlate.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Reflection.Emit;

namespace GreenSlate.Database
{
    
    public class ToDoTaskDbContext : IToDoDbContext
    {
        public DbSet<AspNetUser> AspNetUsers {
            get { return db.AspNetUsers; }
            set { }
        }
        public DbSet<ToDoTask> ToDoTasks {
            get { return db.ToDoTasks; }
            set { }
        }

        private ToDoDbContext db;

        public ToDoTaskDbContext()
        {
            db = new ToDoDbContext();
        }

        public bool AddTask(ToDoTask model)
        {
            throw new NotImplementedException();
        }

        public bool DeleteTask(int id, string UserId)
        {
            throw new NotImplementedException();
        }

        public bool EditTask(string userId, ToDoTask model)
        {
            throw new NotImplementedException();
        }

        public ToDoTask GetTaskById(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ToDoTask> GetTasksPerUser(string id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<DbEntityValidationResult> GetValidationErrors()
        {
            throw new NotImplementedException();
        }

        public int SaveChanges()
        {
            return db.SaveChanges();
        }

        public DbEntityEntry Entry(object entity)
        {
            return db.Entry(entity);
        }
    }
}
