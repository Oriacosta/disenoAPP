using Microsoft.EntityFrameworkCore;
using EventoApi.Models;

namespace EventoApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Evento> Evento { get; set; }
        public DbSet<Lugar> Lugar { get; set; }
    }
}
