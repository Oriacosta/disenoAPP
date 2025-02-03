using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EventoApi.Models;

namespace EventoApi.Models
{
    public class Evento
    {
        [Key]
        public int ID { get; set; }

        [Required, MaxLength(45)]
        public string? Nombre { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public TimeSpan HorarioInicio { get; set; }

        [Required]
        public TimeSpan HorarioFin { get; set; }

        [MaxLength(255)]
        public string? Descripcion { get; set; }

        [ForeignKey("Lugar")]
        public int LugarID { get; set; }
        public Lugar? Lugar { get; set; }
    }
}
