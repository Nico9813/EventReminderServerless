import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import './App.css';

function App() {

  const { loginWithRedirect, logout, isAuthenticated, user,getIdTokenClaims  } = useAuth0();
  const [eventos, setEventos] = useState([])
  const [eventosRender, setEventosRender] = useState([])
  const [token , setToken] = useState("")

  useEffect(()=>{
    async function getEventos(){

      const accessToken = await getIdTokenClaims();
      const path = 'https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events?status=OPEN'
      const options = {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${accessToken?.__raw}`
        }
      }
      setToken(accessToken.__raw)

      const data = await fetch(path, options)
      const eventosAPI = await data.json()
      setEventos(eventosAPI)
      setEventosRender(eventosAPI)
    }
    if (isAuthenticated) {
      getEventos()
    }
  }, [isAuthenticated])

  const actualiziarEvento = (nuevoEvento) => {
    setEventosRender(prevEvt => prevEvt.map(evt => evt.id === nuevoEvento.id ? nuevoEvento : evt))
  }

  const suscribirse = async (id) => {
    const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}/suscribers`
    const options = {
      method:'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    const data = await fetch(path, options)
    const response = await data.json()
    actualiziarEvento(response)
  }

  const eliminarSuscripcion = async(id) => {
    const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}/suscribers`
    const options = {
      method: 'DELETE',
      headers:{
        'Authorization': `Bearer ${token}`
      }
    }
    const data = await fetch(path, options)
    const response = await data.json()
    actualiziarEvento(response)
  }

  const eliminarEvento = async(id) => {
    setEventosRender(prev => prev.filter(evt => evt.id !== id))
    const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}`
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    await fetch(path, options)
  }

  return (
    <div className="App">
      <div className="NavBar">
        <p>EVENT REMINDER</p>
        {isAuthenticated? 
          <button onClick={() => logout()}>Log Out</button>
          :
          <button onClick={() => loginWithRedirect()}>Log In</button>
        }
        
        
      </div>
      <h1>Eventos actuales</h1>
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
                      <button className="Button Eliminar" onClick={() => eliminarEvento(evento.id)}>Eliminar</button>
                      <p>Owner</p>
                    </>
                    :
                    evento.suscribers?.some(email => email === user.email) ?
                      <button className="Button" onClick={() => eliminarSuscripcion(evento.id)}>Desuscribirse</button>
                      :
                      <button className="Button" onClick={() => suscribirse(evento.id)}>Suscribirse</button>
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
    </div>
  );
}

export default App;
