import React, { useEffect, useState } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const Employee_Time_Table = () => {
    const [timeOp, setTimeOP] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = collection(db, "TimeOperation");
                getDocs(docRef).then((resp) => {
                    setTimeOP(
                        resp.docs.map((doc) => {
                            return { ...doc.data(), id: doc.id }
                        })
                    )
                })
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    function convertTimeToSeconds(time) {
        const parts = time.split(':');
        let seconds = 0;
        if (parts.length === 3) {
            seconds += parseInt(parts[0]) * 3600; // Horas
            seconds += parseInt(parts[1]) * 60;   // Minutos
            seconds += parseFloat(parts[2]);       // Segundos
        } else if (parts.length === 2) {
            seconds += parseInt(parts[0]) * 60;   // Minutos
            seconds += parseFloat(parts[1]);       // Segundos
        }
        return seconds;
    }

    function convertSecondsToTimeFormat(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <div style={{ width: '30%', margin: '5x' }}>
            <h4 style={{ textAlign: 'center' }}>Production time per employee on CNC</h4>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b">Empleado</th>
                        <th className="px-6 py-3 border-b">Tiempo Total </th>
                        <th className="px-6 py-3 border-b">Porcentaje</th>
                    </tr>
                </thead>
                <tbody>
                    {timeOp.length > 0 && Object.values(timeOp.reduce((acc, current) => {
                        const name = current.Empleado;
                        if (!acc[name]) {
                            acc[name] = { Empleado: name, tiempo: 0 };
                        }
                        if (current["Tiempo "]) {
                            acc[name].tiempo += convertTimeToSeconds(current["Tiempo "]);
                        }
                        return acc;
                    }, {})).map((item, index) => {
                        const totalTime = Object.values(timeOp.reduce((acc, current) => {
                            if (current["Tiempo "]) {
                                acc.total = (acc.total || 0) + convertTimeToSeconds(current["Tiempo "]);
                            }
                            return acc;
                        }, {})).reduce((a, b) => a + b, 0);

                        const percentage = ((item.tiempo / totalTime) * 100).toFixed(1);

                        return (
                            <tr key={index}>
                                <td className="px-6 py-4 border-b">{item.Empleado}</td>
                                <td className="px-6 py-4 border-b">{convertSecondsToTimeFormat(item.tiempo)}</td>
                                <td className="px-6 py-4 border-b">{percentage}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Employee_Time_Table 