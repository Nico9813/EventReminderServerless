import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import '../App.css';
import useEventApi from '../hooks/useEventApi';
import { Link } from 'react-router-dom';

function Eventos() {

    const { user } = useAuth0();
    const { obtenerEventos, suscribirse, eliminarEvento, eliminarSuscripcion} = useEventApi()
    const [eventos, setEventos] = useState([])
    const [eventosRender, setEventosRender] = useState([])

    useEffect(() => {
        setInterval(async() => {
            const eventosActualiziados = await obtenerEventos()
            setEventos(eventosActualiziados)
            setEventosRender(eventosActualiziados)
        }, 30000)
    }, [])

    const actualiziarEvento = (nuevoEvento) => {
        setEventosRender(prevEvt => prevEvt.map(evt => evt.id === nuevoEvento.id ? nuevoEvento : evt))
    }

    const _suscribirse = async (id) => {
        const response = await suscribirse(id)
        actualiziarEvento(response)
    }

    const _eliminarSuscripcion = async (id) => {
        const response = await eliminarSuscripcion(id)
        actualiziarEvento(response)
    }

    const _eliminarEvento = async (id) => {
        setEventosRender(prev => prev.filter(evt => evt.id !== id))
        await eliminarEvento(id)
    }

    return (
        <>  
            <div className="Titulo">
                <h1>Eventos actuales</h1>
                <Link to="/create"><h1>Crear evento</h1></Link>
            </div>
            <input placeholder="Buscar eventos" className="BarraBusqueda" onChange={(evt) => setEventosRender(eventos.filter(evento_actual => evento_actual.title.includes(evt.target.value)))}></input>
            <div className="Container">
                {eventosRender.length ?
                    eventosRender.map((evento, index) =>
                        <div key={`evento ${index}`} className="Evento">
                            <div className="EventoImgContainer">
                                <img className="EventoImg" src={evento.pictureUrl} alt={evento.title} />
                            </div>
                            <div className="DetallesContainer">
                                <div className="DetallesRow">
                                    <h3>{evento.title} ({evento.eventType})</h3>
                                </div>
                                <div className="DetallesRow">
                                    <p>Proxima fecha: {new Date(evento.nextTime).toUTCString()}</p>
                                </div>
                                <div className="DetallesRow">
                                    {evento.createdBy === user.email ?
                                        <>
                                            <button className="Button Eliminar" onClick={() => _eliminarEvento(evento.id)}>Eliminar</button>
                                            <p>Owner</p>
                                        </>
                                        :
                                        evento.suscribers?.some(email => email === user.email) ?
                                            <button className="Button" onClick={() => _eliminarSuscripcion(evento.id)}>Desuscribirse</button>
                                            :
                                            <button className="Button" onClick={() => _suscribirse(evento.id)}>Suscribirse</button>
                                    }

                                    <p>Actuales: {evento.suscribers?.length ?? 0}</p>
                                </div>

                            </div>
                        </div>
                    )
                    :
                    <p>No se encontraron eventos</p>
                }

            </div>
        </>
    );
}

export default Eventos;
