import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form';
import { Navigate, useParams } from "react-router-dom";
import { db } from '../../firebase/firebase'

const Project = () => {
    const [pieza, setItem] = useState('')
    const [errorMessage] = useState('')
    const [isAddItem,setIsAddItem] = useState(false)
    const proj = useParams().Proyecto;

    const { handleSubmit } = useForm();

    const onSubmit = (data) => {
        const proyect = {
            Proyecto: proj,
            Item: pieza,
        }
        console.log(proyect);

        const proyectRef = collection(db, "Piezas");
        addDoc(proyectRef, proyect).then((doc) => {
            console.log(doc);
        })
        setIsAddItem(true);
    }
    return (
        <div>
            {isAddItem && (<Navigate to={`/project/${proj}`} replace={true} />)}
            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Proyecto</h3>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Ingrese el nombre de la pieza
                            </label>
                            <input
                                type="text"
                                autoComplete='text'
                                required
                                value={pieza}
                                onChange={(e) => {
                                    setItem(e.target.value)
                                }}

                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Ingrese el nombre del Proyecto
                            </label>
                            <input
                                type="text"
                                autoComplete='text'
                                required
                                value={proj}
                                readOnly={true}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isAddItem ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            Añadir pieza
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Project