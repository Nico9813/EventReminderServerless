import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"

export const useEventApi = () => {

    const { isAuthenticated, getIdTokenClaims } = useAuth0()
    let token

    const getToken = async () => {
        if(!token){
            if (isAuthenticated) {
                const tokenAcceso = await getIdTokenClaims()
                token = tokenAcceso.__raw
            }
        }
        return token;
    }

    return {
        obtenerEventos: async() => {
            const path = 'https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events?status=OPEN'
            const options = {
                method: "GET"
            }

            const data = await fetch(path, options)
            return await data.json()
        },
        eliminarEvento: async(id) => {
            const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}`
            const options = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            }
            return await fetch(path, options)
        },
        suscribirse: async(id) => {
            const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}/suscribers`
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            }
            const data = await fetch(path, options)
            return await data.json()
        },
        eliminarSuscripcion: async(id) => {
            const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}/suscribers`
            const options = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            }
            const data = await fetch(path, options)
            return await data.json()
        },
        crearEvento: async(title, eventType, firstTime) => {
            const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events`
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                },
                body: {
                    title,
                    eventType,
                    firstTime,
                }
            }
            const data = await fetch(path, options)
            const response = await data.json()
            console.log(response)
            return await response
        },
        cargarImagenEvento: async (id, base64image) => {
            const path = `https://ffvwca9yaf.execute-api.us-east-1.amazonaws.com/dev/events/${id}/picture`
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                },
                body: base64image
            }
            const data = await fetch(path, options)
            return await data.json()
        },
    }
}

export default useEventApi;