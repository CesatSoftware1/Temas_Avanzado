/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Weekly_Production = () => {
    const [chartData, setChartData] = useState([]);
    const [selectedQuarter, setSelectedQuarter] = useState('Q1'); // Estado para el trimestre seleccionado

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = collection(db, "TimeOperation");
                const resp = await getDocs(docRef);
                const data = resp.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                const chartDataProcessed = processDataForChart(data, selectedQuarter);
                setChartData(chartDataProcessed);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedQuarter]); // Dependencia para volver a cargar datos al cambiar el trimestre

    const processDataForChart = (data, quarter) => {
        const monthRanges = {
            'Q1': [0, 2], // Enero, Febrero, Marzo
            'Q2': [3, 5], // Abril, Mayo, Junio
            'Q3': [6, 8], // Julio, Agosto, Septiembre
            'Q4': [9, 11] // Octubre, Noviembre, Diciembre
        };

        const [startMonth, endMonth] = monthRanges[quarter];

        const groupData = data.reduce((acc, current) => {
            const dateStr = current.Fecha; // Asumiendo que `Fecha` está en formato "mes/día/año"
            const dateParts = dateStr.split('/').map(Number);
            const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]); // Crear objeto Date (mes - 1)

            // Filtrar por mes del trimestre seleccionado
            if (date.getMonth() >= startMonth && date.getMonth() <= endMonth) {
                const weekNumber = getWeekNumber(date);
                const year = date.getFullYear();
                const weekYearKey = `${year}-W${weekNumber}`; // Ej: "2024-W45"
                if (!acc[weekYearKey]) {
                    acc[weekYearKey] = { Fecha: weekYearKey, tiempo: 0 };
                }
                if (current["Tiempo "]) {
                    acc[weekYearKey].tiempo += convertTimeToSeconds(current["Tiempo "]);
                }
            }
            return acc;
        }, {});

        // Convertir el objeto a un array
        return Object.values(groupData).map(proj => ({
            Fecha: proj.Fecha,
            tiempo: proj.tiempo / 3600 // Convertir a horas
        }));
    };

    const getWeekNumber = (date) => {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startDate.getDay() + 1) / 7);
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

    return (
        <div>
            <label htmlFor="quarterSelect">Select Quarter:</label> <select
                id="quarterSelect"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
            >
                <option value="Q1">Q1 (Enero - Marzo)</option>
                <option value="Q2">Q2 (Abril - Junio)</option>
                <option value="Q3">Q3 (Julio - Septiembre)</option>
                <option value="Q4">Q4 (Octubre - Diciembre)</option>
            </select>
            <BarChart
                width={1000}
                height={300}
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="Fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tiempo" fill="#82ca9d"/>
            </BarChart>
        </div>
    );
}

export default Weekly_Production;