import React, { useEffect, useState } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Project_Time_Bar = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = collection(db, "TimeOperation");
                const resp = await getDocs(docRef);
                const data = resp.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                const chartDataProcessed = processDataForChart(data);
                setChartData(chartDataProcessed);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const processDataForChart = (data) => {
        const groupData = data.reduce((acc, current) => {
            const name = current.Projecto;
            if (!acc[name]) {
                acc[name] = { Projecto: name, tiempo: 0 }
            }
            if (current["Tiempo "]) {
                acc[name].tiempo += convertTimeToSeconds(current["Tiempo "])
            }
            return acc;
        }, {});

        const result = Object.values(groupData).map(proj => ({
            Projecto: proj.Projecto,
            tiempo: proj.tiempo / 3600 // Convertir a horas
        }));


        return {
            labels: result.map(item => item.Projecto),
            datasets: [{
                label: 'Tiempo en horas',
                data: result.map(item => item.tiempo),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
        };
    };

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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Project Production on CNC Machine',
            },
        },
    };
    return (
        <div style={{ width: '50%', margin: '2px', padding: '2px' }}>
            {chartData.labels.length > 0 && (
                <Bar data={chartData} options={options} />
            )}
        </div>
    )
}

export default Project_Time_Bar 