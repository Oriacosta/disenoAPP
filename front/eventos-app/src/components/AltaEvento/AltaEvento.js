import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AltaEvento.css'; // Importa el archivo CSS

const AltaEvento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventoEditado = location.state?.evento;

  const [form, setForm] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    nombre: '',
    lugar: '',
    descripcion: '',
  });

  useEffect(() => {
    if (eventoEditado) {
      setForm(eventoEditado);
    }
  }, [eventoEditado]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventoEditado) {
      console.log('Evento actualizado:', form);
    } else {
      console.log('Nuevo evento creado:', form);
    }
    navigate('/');
  };

  return (
    <div className="alta-evento-container">
      <h1 className="alta-evento-title">
        {eventoEditado ? 'Editar Evento' : 'Alta Evento'}
      </h1>
      <form onSubmit={handleSubmit} className="alta-evento-form">
        <div>
          <label className="alta-evento-label">Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="alta-evento-input"
          />
        </div>

        <div className="alta-evento-grid">
          <div>
            <label className="alta-evento-label">Hora Inicio:</label>
            <input
              type="time"
              name="horaInicio"
              value={form.horaInicio}
              onChange={handleChange}
              required
              className="alta-evento-input"
            />
          </div>

          <div>
            <label className="alta-evento-label">Hora Fin:</label>
            <input
              type="time"
              name="horaFin"
              value={form.horaFin}
              onChange={handleChange}
              required
              className="alta-evento-input"
            />
          </div>
        </div>

        <div>
          <label className="alta-evento-label">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="alta-evento-input"
          />
        </div>

        <div>
          <label className="alta-evento-label">Lugar:</label>
          <input
            type="text"
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            required
            className="alta-evento-input"
          />
        </div>

        <div>
          <label className="alta-evento-label">Descripción:</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="alta-evento-textarea"
          ></textarea>
        </div>

        <div className="alta-evento-buttons">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="alta-evento-button alta-evento-button-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="alta-evento-button alta-evento-button-save"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AltaEvento;