import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BuscarEvento.css'; // Importa el archivo CSS

const BuscarEvento = () => {
  const navigate = useNavigate();

  const eventos = [
    { id: 1, nombre: 'Pepe', fecha: '12/12/2025', horaInicio: '12:50', horaFin: '13:30', lugar: 'Avellaneda', descripcion: 'Otras' },
  ];

  const handleEliminarEvento = (eventoId) => {
    const confirmarEliminacion = window.confirm('¿Estás seguro que quieres eliminar este evento?');
    if (confirmarEliminacion) {
      // Aquí puedes agregar la lógica para eliminar el evento
      console.log(`Evento con ID ${eventoId} eliminado`);
      // Por ejemplo, podrías filtrar el evento del array de eventos y actualizar el estado
    }
  };

  return (
    <div className="buscar-evento-container">
      <h1 className="buscar-evento-title">Buscar Evento</h1>
      
      {/* Barra de búsqueda */}
      <div className="buscar-evento-search-bar">
        <input
          type="text"
          placeholder="Buscar evento..."
          className="buscar-evento-input"
        />
        <button
          onClick={() => navigate('/alta')}
          className="buscar-evento-button buscar-evento-button-add"
        >
          +
        </button>
      </div>
      
      {/* Tabla */}
      <table className="buscar-evento-table">
        <thead>
          <tr className="buscar-evento-table-header">
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Lugar</th>
            <th>Descripción</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id} className="buscar-evento-table-row">
              <td>{evento.nombre}</td>
              <td>{evento.fecha}</td>
              <td>{evento.horaInicio}</td>
              <td>{evento.horaFin}</td>
              <td>{evento.lugar}</td>
              <td>{evento.descripcion}</td>
              <td>
                <button
                  onClick={() => navigate('/alta', { state: { evento } })}
                  className="buscar-evento-button-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminarEvento(evento.id)}
                  className="buscar-evento-button-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuscarEvento;