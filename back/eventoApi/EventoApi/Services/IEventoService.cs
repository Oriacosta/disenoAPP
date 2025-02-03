using EventoApi.Models;

namespace EventoApi.Services
{
    public interface IEventoService
    {
        Task<IEnumerable<Evento>> GetEventosAsync();
        Task<Evento?> GetEventoByIdAsync(int id);
        Task<Evento> CreateEventoAsync(Evento evento);
        Task<bool> UpdateEventoAsync(int id, Evento evento);
        Task<bool> DeleteEventoAsync(int id);
    }
}
