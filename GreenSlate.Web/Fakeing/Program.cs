using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bogus;
using GreenSlate.Database.Model;


namespace Fakeing
{
    class Program
    {
        static void Main(string[] args)
        {
            Program p=new Program();
            p.FakeUsersOnly();
        }


        public void FakeUsersOnly()
        {
            ToDoDbContext _context = new ToDoDbContext();
            int gigid = 100;
            var genres = new[] { 1, 2, 3, 4 };
            var usersFaker = new Faker<AspNetUser>()
                .CustomInstantiator(f => new AspNetUser())
                .RuleFor(u => u.Id, f => Guid.NewGuid().ToString())
                .RuleFor(u => u.Name, f => f.Name.FullName())
                .RuleFor(u => u.UserName, f => f.Internet.UserName())
                .RuleFor(u => u.Email, f => f.Person.Email)
                .FinishWith((f, u) => { Console.WriteLine("User Created"); });
            var users = usersFaker.Generate(30);

            _context.AspNetUsers.AddRange(users);

            _context.SaveChanges();
        }
    }
}
