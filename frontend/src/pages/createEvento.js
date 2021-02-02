import { useState } from "react";
import { useHistory } from "react-router-dom";
import useEventApi from "../hooks/useEventApi";

export const CreateEvento = () => {

    const [title, setTitle] = useState("")
    const [firstTime, setFirstTime] = useState("")
    const [eventType, setEventType] = useState("")
    const [image, setImage] = useState(null)
    const { crearEvento, cargarImagenEvento } = useEventApi()

    const history = useHistory()

    const handleFileChange = (evt) => {
        const file = evt.target.files[0]
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = () => {
            setImage(reader.result)
        }
    }

    const _crearEvento = async() =>{
        console.log(title, new Date(firstTime).toISOString(), eventType)
        const { id } = await crearEvento(title, new Date(firstTime).toISOString(), eventType)
        console.log(id)
        if(image){
            await cargarImagenEvento(id, image)
        }
        history.push("/")
    }

    return(
        <div className="Container">
            <div className="FormContainer">
                    <label>Titulo: </label>
                    <input 
                        type="text" 
                        value={title} onChange={evt => setTitle(evt.target.value)}/>
                    <label>Primer fecha: </label>
                    <input 
                        type="datetime-local" 
                        value={firstTime} onChange={evt => setFirstTime(evt.target.value)}/>
                    <label>Repeticion: </label>
                    <select 
                        type="dropdown" 
                        value={eventType} onChange={evt => setEventType(evt.target.value)}>
                        <option value="Single">Unico</option>
                        <option value="Daily">Diario</option>
                        <option value="Weekly">Semanal</option>
                        <option value="Monthly">Mensual</option>
                    </select>
                    <input
                        type="file"
                        onChange={evt => handleFileChange(evt)} />
                    <button onClick={()=> _crearEvento()}>Crear</button>
            </div>
        </div>
    )
}

export default CreateEvento;