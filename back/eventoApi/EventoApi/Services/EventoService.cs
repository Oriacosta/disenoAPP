using EventoApi.Data;
using EventoApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventoApi.Services
{
    public class EventoService : IEventoService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<EventoService> _logger;

        public EventoService(ApplicationDbContext context, ILogger<EventoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Evento>> GetEventosAsync()
        {
            var eventos = await _context.Evento.Include(e => e.Lugar).ToListAsync();
            if (!eventos.Any())
            {
                _logger.LogWarning("No se encontraron eventos en la base de datos.");
            }
            return eventos;
        }

        public async Task<Evento?> GetEventoByIdAsync(int id)
        {
            if (id <= 0)
            {
                _logger.LogError("ID inválido: {Id}", id);
                throw new ArgumentException("El ID debe ser mayor a 0.", nameof(id));
            }

            var evento = await _context.Evento.Include(e => e.Lugar)
                                              .FirstOrDefaultAsync(e => e.ID == id);
            if (evento == null)
            {
                _logger.LogWarning("Evento con ID {Id} no encontrado.", id);
            }
            return evento;
        }

        public async Task<Evento> CreateEventoAsync(Evento evento)
        {
            if (evento == null)
            {
                throw new ArgumentNullException(nameof(evento), "El evento no puede ser nulo.");
            }

            _context.Evento.Add(evento);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Evento con ID {Id} creado exitosamente.", evento.ID);
            return evento;
        }

        public async Task<bool> UpdateEventoAsync(int id, Evento evento)
        {
            if (id != evento.ID)
            {
                _logger.LogError("Error al actualizar: ID proporcionado {Id} no coincide con el evento {EventoId}", id, evento.ID);
                return false;
            }

            var existingEvento = await _context.Evento.FindAsync(id);
            if (existingEvento == null)
            {
                _logger.LogWarning("Intento de actualizar evento con ID {Id}, pero no existe.", id);
                return false;
            }

            _context.Entry(existingEvento).CurrentValues.SetValues(evento);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Evento con ID {Id} actualizado exitosamente.", id);
            return true;
        }

        public async Task<bool> DeleteEventoAsync(int id)
        {
            var evento = await _context.Evento.FindAsync(id);
            if (evento == null)
            {
                _logger.LogWarning("Intento de eliminar evento con ID {Id}, pero no existe.", id);
                return false;
            }

            _context.Evento.Remove(evento);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Evento con ID {Id} eliminado exitosamente.", id);
            return true;
        }
    }
}
