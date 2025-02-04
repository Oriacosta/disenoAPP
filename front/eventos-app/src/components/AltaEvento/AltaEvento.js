import { useState, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./AltaEvento.css"

// Función debounce
const debounce = (func, waitFor) => {
  let timeout = null

  return (...args) => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
  }
}

// Función simulada para buscar lugares
const buscarLugares = async (query) => {
  // En una aplicación real, aquí se llamaría a una API
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simula retraso de API
  const lugaresEjemplo = [
    "Movistar Arena, Buenos Aires",
    "Luna Park, Buenos Aires",
    "Velez, Buenos Aires",
  ]
  return lugaresEjemplo.filter((lugar) => lugar.toLowerCase().includes(query.toLowerCase()))
}

const AltaEvento = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const eventoEditado = location.state?.evento

  const [form, setForm] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    nombre: "",
    lugar: "",
    descripcion: "",
  })

  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [estaBuscando, setEstaBuscando] = useState(false)

  useEffect(() => {
    if (eventoEditado) {
      setForm(eventoEditado)
    }
  }, [eventoEditado])

  const busquedaConDebounce = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        setEstaBuscando(true)
        const resultados = await buscarLugares(query)
        setResultadosBusqueda(resultados)
        setEstaBuscando(false)
      } else {
        setResultadosBusqueda([])
      }
    }, 300),
    [],
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === "lugar") {
      busquedaConDebounce(value)
    }
  }

  const handleSeleccionarLugar = (lugar) => {
    setForm({ ...form, lugar: lugar })
    setResultadosBusqueda([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (eventoEditado) {
      console.log("Evento actualizado:", form)
    } else {
      console.log("Nuevo evento creado:", form)
    }
    navigate("/")
  }

  return (
    <div className="alta-evento-container">
      <h1 className="alta-evento-title">{eventoEditado ? "Editar Evento" : "Alta Evento"}</h1>
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
        <div className="alta-evento-search-container">
          <label className="alta-evento-label">Lugar:</label>
          <input
            type="text"
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            required
            className="alta-evento-input"
            placeholder="Buscar lugar..."
          />
          {estaBuscando && <div className="alta-evento-searching">Buscando...</div>}
          {resultadosBusqueda.length > 0 && (
            <ul className="alta-evento-search-results">
              {resultadosBusqueda.map((lugar, index) => (
                <li key={index} onClick={() => handleSeleccionarLugar(lugar)} className="alta-evento-search-item">
                  {lugar}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Otros campos del formulario permanecen sin cambios */}

        <div className="alta-evento-buttons">
          <button type="button" onClick={() => navigate("/")} className="alta-evento-button alta-evento-button-cancel">
            Cancelar
          </button>
          <button type="submit" className="alta-evento-button alta-evento-button-save">
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AltaEvento;