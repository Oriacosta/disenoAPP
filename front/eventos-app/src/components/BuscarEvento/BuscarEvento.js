import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, getEventById, getLugares } from "../apiService/apiService";
import './BuscarEvento.css';

const BuscarEvento = () => {
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarLugares = useCallback(async () => {
        try {
            const response = await getLugares();
            const lugaresFormateados = response.data.map(lugar => ({
                ...lugar,
                id: typeof lugar.id === 'string' ? parseInt(lugar.id, 10) : lugar.id
            }));
            setLugares(lugaresFormateados);
        } catch (err) {
            console.error('Error al cargar lugares:', err);
            setError('Error al cargar los lugares');
        }
    }, []);

    const cargarEventos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getEvents();
            const eventosFormateados = response.data.map(evento => ({
                ...evento,
                lugarId: typeof evento.lugarId === 'string' ? parseInt(evento.lugarId, 10) : evento.lugarId,
                fecha: new Date(evento.fecha).toLocaleDateString(),
                horarioInicio: evento.horarioInicio?.slice(0, 5) || '',
                horarioFin: evento.horarioFin?.slice(0, 5) || ''
            }));
            setEventos(eventosFormateados);
            setError(null);
        } catch (err) {
            setError('Error al cargar los eventos');
            console.error('Error al cargar eventos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEditarEvento = useCallback(async (eventoId) => {
        try {
            const response = await getEventById(eventoId);
            if (!response.data) {
                throw new Error('No se encontró el evento');
            }

            const eventoFormateado = {
                ...response.data,
                fecha: new Date(response.data.fecha).toISOString().split('T')[0],
                horarioInicio: response.data.horarioInicio?.slice(0, 5) || '',
                horarioFin: response.data.horarioFin?.slice(0, 5) || ''
            };

            navigate('/alta', { state: { evento: eventoFormateado, lugares } });
        } catch (err) {
            setError(`Error al obtener evento: ${err.message}`);
            console.error('Error al obtener evento:', err);
        }
    }, [lugares, navigate]);

    const getNombreLugar = useCallback((lugarId) => {
        if (!lugarId) {
            return 'Sin lugar asignado';
        }

        const lugarIdNumerico = typeof lugarId === 'string' ? parseInt(lugarId, 10) : lugarId;
        const lugar = lugares.find(l => {
            const lugarListaId = typeof l.id === 'string' ? parseInt(l.id, 10) : l.id;
            return lugarListaId === lugarIdNumerico;
        });

        return lugar ? lugar.nombre : 'Lugar no encontrado';
    }, [lugares]);

    const eventosFiltrados = useMemo(() => {
        return eventos.filter(evento => {
            const lugarIdNumerico = typeof evento.lugarId === 'string' ? 
                parseInt(evento.lugarId, 10) : evento.lugarId;
            
            const lugarNombre = lugares.find(l => {
                const lugarListaId = typeof l.id === 'string' ? parseInt(l.id, 10) : l.id;
                return lugarListaId === lugarIdNumerico;
            })?.nombre || '';

            const searchTerm = busqueda.toLowerCase();
            
            return (
                (evento.nombre?.toLowerCase().includes(searchTerm)) ||
                (lugarNombre.toLowerCase().includes(searchTerm)) ||
                (evento.descripcion?.toLowerCase().includes(searchTerm))
            );
        });
    }, [eventos, busqueda, lugares]);

    useEffect(() => {
        const inicializarDatos = async () => {
            try {
                await cargarLugares();
                await cargarEventos();
            } catch (err) {
                console.error('Error al inicializar datos:', err);
                setError('Error al cargar los datos iniciales');
            }
        };

        inicializarDatos();
    }, [cargarEventos, cargarLugares]);

    if (loading) {
        return (
            <div className="buscar-evento-loading">
                <p>Cargando eventos...</p>
            </div>
        );
    }

    return (
        <div className="buscar-evento-container">
            {error && (
                <div className="buscar-evento-error">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            )}

            <h1 className="buscar-evento-title">Buscar Evento</h1>

            <div className="buscar-evento-search-bar">
                <input
                    type="text"
                    placeholder="Buscar evento..."
                    className="buscar-evento-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    aria-label="Buscar evento"
                />
                <button
                    onClick={() => navigate('/alta')}
                    className="buscar-evento-button buscar-evento-button-add"
                    aria-label="Añadir nuevo evento"
                >
                    +
                </button>
            </div>

            {lugares.length === 0 && (
                <div className="buscar-evento-warning">
                    <p>No hay lugares disponibles. Por favor, agregue lugares antes de crear eventos.</p>
                </div>
            )}

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
                    {eventosFiltrados.map((evento) => (
                        <tr key={evento.id} className="buscar-evento-table-row">
                            <td>{evento.nombre || 'Sin nombre'}</td>
                            <td>{evento.fecha || 'Sin fecha'}</td>
                            <td>{evento.horarioInicio || 'No especificado'}</td>
                            <td>{evento.horarioFin || 'No especificado'}</td>
                            <td>{getNombreLugar(evento.lugarId)}</td>
                            <td>{evento.descripcion || 'Sin descripción'}</td>
                            <td>
                                <button
                                    onClick={() => handleEditarEvento(evento.id)}
                                    className="buscar-evento-button-edit"
                                    aria-label={`Editar evento ${evento.nombre}`}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {eventosFiltrados.length === 0 && !loading && (
                <div className="buscar-evento-no-results">
                    <p>No se encontraron eventos{busqueda ? ' que coincidan con la búsqueda' : ''}.</p>
                </div>
            )}
        </div>
    );
};

export default BuscarEvento;