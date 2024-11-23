import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form';
import { Navigate } from "react-router-dom";
import { db } from '../../firebase/firebase'

const Project = () => {
    const [proyecto, setProyecto] = useState('')
    const [empresa, setEmpresa] = useState('')
    const [errorMessage] = useState('')
    const [isAddProyect] = useState(false)

    const { handleSubmit } = useForm();

    const onSubmit = (data) => {
        const proyect = {
            Proyecto: proyecto,
            Compañia: empresa
        }
        console.log(proyect);

        const proyectRef = collection(db, "Proyectos");
        addDoc(proyectRef, proyect).then((doc) => {
            console.log(doc);
        })
    }
    return (
        <div>
            {isAddProyect && (<Navigate to={`/project`} replace={true} />)}
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
                                Ingrese el nombre del Proyecto
                            </label>
                            <input
                                type="text"
                                autoComplete='text'
                                required
                                value={proyecto}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setProyecto(e.target.value)
                                    console.log('El proyecto es: ' + proyecto)
                                }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Ingrese el nombre de la empresa
                            </label>
                            <input
                                type="text"
                                autoComplete='text'
                                required
                                value={empresa} onChange={(e) => {
                                    console.log(e.target.value)
                                    setEmpresa(e.target.value)
                                    console.log('La empresa es: ' + empresa)
                                }}

                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isAddProyect ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            Añadir proyecto
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Project