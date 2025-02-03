using System.ComponentModel.DataAnnotations;

namespace EventoApi.Models
{
    public class Lugar
    {
        [Key]
        public int ID { get; set; }

        [Required, MaxLength(100)]
        public string? Nombre { get; set; }
    }
}
