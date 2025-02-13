using Microsoft.AspNetCore.Mvc;
using EventoApi.Models;
using EventoApi.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventoApi.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class LugarController : ControllerBase
    {
        private readonly ILugarService _lugarService;
        private readonly ILogger<LugarController> _logger;

        public LugarController(ILugarService lugarService, ILogger<LugarController> logger)
        {
            _lugarService = lugarService;
            _logger = logger;
        }

        // ✅ Obtener todos los lugares
        [HttpGet("ListaLugares")]
        public async Task<IActionResult> ObtenerLugares()
        {
            try
            {
                var lugares = await _lugarService.ObtenerLugaresAsync();
                if (lugares == null || !lugares.Any())
                {
                    return NotFound("No se encontraron lugares disponibles.");
                }
                return Ok(lugares);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la lista de lugares.");
                return StatusCode(500, "Error interno del servidor.");
            }
        }
    }
}
