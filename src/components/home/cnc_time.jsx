import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import icon from 'C:\\Users\\Antonio Romero\\Documents\\GitHub\\Cesat_Report\\src\\assets\\icons\\cnc-machine.svg';
const db = getFirestore();

export const primaryColor = '#3498db';

export const getTimeMachine = async (machine) => {
    const tiemposRef = collection(db, 'TimeOperation');
    const q = query(tiemposRef, where('Maquina', '==', machine));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return '0 hr:00 min:00 sg'; // Devuelve tiempo por defecto si no se encuentran documentos
    }

    return sumTime(querySnapshot.docs);
};

const sumTime = (queryTimeDocs) => {
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;

    queryTimeDocs.forEach(dataTime => {
        const tiempo = dataTime.data()['Tiempo '];

        const regex = /(\d{1}):(\d{2}):(\d{2}).(\d{6})/;
        const match = regex.exec(tiempo);

        if (match) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const seconds = parseInt(match[3]);

            totalHours += hours;
            totalMinutes += minutes;
            totalSeconds += seconds;
        } else {
            console.error(`Error parsing time: ${tiempo}`);
        }
    });

    // Convertir segundos a minutos
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60; // Mantener solo los segundos restantes

    // Convertir minutos a horas
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60; // Mantener solo los minutos restantes

    // Formatear el tiempo total
    const formattedTime = `${totalHours > 0 ? `${totalHours} hr :` : ''}${totalMinutes.toString().padStart(2, '0')} min :${totalSeconds.toString().padStart(2, '0')} sg`;

    return formattedTime;
};

const AnalyticInfoCard = ({ color, svgSrc, title, count, textcolor }) => {
    return (
        <div style={{padding: '15px' , flex: '1 1 200px', flexDirection: 'column', textAlign: 'center' }}>
            <img src={svgSrc} alt={title} style={{ width: '30px', height: '50px' }} />
            <h3 style={{ color: textcolor, }}>{title}</h3>
            <p style={{ color: textcolor }}>{count}</p>
        </div>
    );
};
const Cnc_Time = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = ['1', '2', '3', '4'].map(machine => getTimeMachine(machine));
                const results = await Promise.all(promises);
                setData(results);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', Wrap: 'wrap' }}>
            {data.map((timeTotal, index) => (
                <AnalyticInfoCard
                    key={index}
                    color={primaryColor}
                    svgSrc={icon}
                    title={`CNC Machine #${index + 1}`}
                    count={timeTotal}
                    textcolor='black'
                />
            ))}
        </div>
    );
};

export default Cnc_Time;