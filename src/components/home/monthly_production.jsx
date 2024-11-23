/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
} from 'recharts';

const Monthly_Production = () => {
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
            const date = new Date(dateParts[2], dateParts[0] - 1); // Crear objeto Date (mes - 1)

            if (date.getMonth() >= startMonth && date.getMonth() <= endMonth) {
                const monthYearKey = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // Ej: "Noviembre 2024"

                if (!acc[monthYearKey]) {
                    acc[monthYearKey] = { Fecha: monthYearKey, tiempo: 0 };
                }
                if (current["Tiempo "]) {
                    acc[monthYearKey].tiempo += convertTimeToSeconds(current["Tiempo "]);
                }
            }
            return acc;
        }, {});

        const result = Object.values(groupData).map(proj => ({
            Fecha: proj.Fecha,
            tiempo: proj.tiempo / 3600 // Convertir a horas
        }));

        // Ordenar los resultados por fecha
        result.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

        return result;
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
            <h4>Monthly Production CNC Machine</h4>
            <label htmlFor="quarterSelect">Select Quarter:</label>
            <select
                id="quarterSelect"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
            >
                <option value="Q1">Q1 (Enero - Marzo)</option>
                <option value="Q2">Q2 (Abril - Junio)</option>
                <option value="Q3">Q3 (Julio - Septiembre)</option>
                <option value="Q4">Q4 (Octubre - Diciembre)</option>
            </select>
            <AreaChart
                data={chartData}
                width={750}
                height={250}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Fecha" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="tiempo" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
        </div>
    );
}

export default Monthly_Production;