using Microsoft.AspNetCore.Mvc;
using EventoApi.Models;
using EventoApi.Services;
using EventoApi.Utilidad;
using System.Linq;

namespace EventoApi.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IEventoService _eventoService;
        private readonly ILogger<EventoController> _logger;

        public EventoController(IEventoService eventoService, ILogger<EventoController> logger)
        {
            _eventoService = eventoService;
            _logger = logger;
        }

        [HttpGet]
        [Route("Listar Eventos")]
        public async Task<IActionResult> ListaEventos()
        {
            var rsp = new Response<List<Evento>>();
            try
            {
                rsp.status = true;
                rsp.value = (await _eventoService.GetEventosAsync()).ToList(); // Convertir a List<Evento>
            }
            catch (Exception ex)
            {
                rsp.status = false;
                _logger.LogError(ex, "Error al obtener los eventos.");
            }
            return Ok(rsp);
        }

        [HttpGet]
        [Route("Evento ID")]
        public async Task<IActionResult> ListaEventoPorId(int id)
        {
            if (id <= 0)
            {
                return BadRequest("El ID proporcionado no es válido.");
            }

            var rsp = new Response<Evento>();
            try
            {
                rsp.status = true;
                rsp.value = await _eventoService.GetEventoByIdAsync(id); // Obtener evento por ID
            }
            catch (Exception ex)
            {
                rsp.status = false;
                _logger.LogError(ex, "Error al obtener el evento por ID.");
            }
            return Ok(rsp);
        }

        [HttpPost]
        [Route("Crear Evento")]
        public async Task<IActionResult> PostEvento(Evento evento)
        {
            var rsp = new Response<Evento>();
            try
            {
                rsp.status = true;
                rsp.value = await _eventoService.CreateEventoAsync(evento);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                _logger.LogError(ex, "Error al crear el evento.");
            }
            return Ok(rsp);
        }

        [HttpPut]
        [Route("Actualizar Evento")]
        public async Task<IActionResult> PutEvento(int id, Evento evento)
        {
            var rsp = new Response<bool>();
            try
            {
                rsp.status = await _eventoService.UpdateEventoAsync(id, evento);
                if (!rsp.status)
                {
                    return BadRequest("No se pudo actualizar el evento.");
                }
            }
            catch (Exception ex)
            {
                rsp.status = false;
                _logger.LogError(ex, "Error al actualizar el evento.");
            }
            return Ok(rsp);
        }

        [HttpDelete]
        [Route("Eliminar Evento")]
        public async Task<IActionResult> DeleteEvento(int id)
        {
            var rsp = new Response<bool>();
            try
            {
                rsp.status = await _eventoService.DeleteEventoAsync(id);
                if (!rsp.status)
                {
                    return NotFound("Evento no encontrado.");
                }
            }
            catch (Exception ex)
            {
                rsp.status = false;
                _logger.LogError(ex, "Error al eliminar el evento.");
            }
            return Ok(rsp);
        }
    }
}
