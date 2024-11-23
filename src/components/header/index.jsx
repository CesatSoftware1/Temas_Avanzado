import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import CesatLogo from 'C:\\Users\\Antonio Romero\\Documents\\GitHub\\Cesat_Report\\src\\assets\\Cesat_Logo.png'
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import icon from 'C:\\Users\\Antonio Romero\\Documents\\GitHub\\Cesat_Report\\src\\assets\\icons\\empleado.svg';

const Header = () => {
    const navigate = useNavigate()
    const router = "/";
    const [employee, setEmployee] = useState('');
    const { userLoggedIn } = useAuth()
    const { currentUser } = useAuth()
    const start = (
        <div>
            <img src={CesatLogo} alt="CESAT Logo" className="h-16 w-auto mr-4" />
        </div>
    );

    useEffect(() => {
        if (userLoggedIn) {
            console.log(currentUser);
            if (currentUser.email) {
                const docRef = collection(db, "Empleados");
                const q = query(docRef, where("correo", "==", currentUser.email));

                // Usa getDocs para obtener los documentos que coinciden con la consulta
                getDocs(q).then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0]; // Accede al primer documento
                        setEmployee(doc.data()); // Maneja los datos del documento
                    } else {
                        console.log("No se encontraron documentos.");
                    }
                }).catch((error) => {
                    console.error("Error al obtener documentos: ", error);
                });
            }
        }
    }, [userLoggedIn, currentUser]);
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            url: `${router}/home`,
        },
        {
            label: 'Features',
            icon: 'pi pi-star'
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'Add Project',
                    icon: 'pi pi-plus-circule',
                    url: `${router}/addproject`
                },
                {
                    label: 'View Project',
                    icon: 'pi pi-eye',
                    url: `${router}/project`
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash'
                },
            ]
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope'
        }
    ];
    const end = (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-sign-out" onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>Logout</Button>
            <img src={icon} style={{ width: '30px', height: '25px' }} />
            <h4>{employee.Nombre} {employee.ApellidoP}</h4>
        </div>
    );

    return (
        userLoggedIn
            ?
            <Menubar model={items} start={start} end={end} />
            :
            <div className="w-full flex justify-start">
                <div className="flex items-center">
                    <h3 className="font-bold text-xl">CESAT Manufacture Solution</h3>
                </div>
            </div>
    )
}

export default Header