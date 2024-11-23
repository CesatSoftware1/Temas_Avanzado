import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { toCapital } from "../../toCapital";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

const DetailProjectContainer = () => {

    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState([]);
    const [timeOp, setTimeOP] = useState([]);
    const proj = useParams().Proyecto;

    const [titulo] = useState("Piezas de ");
    useEffect(() => {
        const docRef = collection(db, "Piezas");
        const q = proj ? query(docRef, where("Proyecto", "==", proj)) : docRef

        getDocs(q).then((resp) => {
            setItem(
                resp.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id }
                }),
            )

        })

        setLoading(false);
        initFilter();
    }, [proj])

    useEffect(() => {
        const docRef = collection(db, "TimeOperation");
        const q = proj ? query(docRef, where("Projecto", "==", proj)) : docRef
        getDocs(q).then((resp) => {
            setTimeOP(
                resp.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id }
                }),
            )
        })

        setLoading(false);
        initFilter();

    }, [proj])
    const data = timeOp.concat(item.filter(it => !timeOp.includes(it)));
    const groupData = data.reduce((acc, current) => {
        const name = current.Item;
        if (!acc[name]) {
            acc[name] = { Item: name, cantidad: 0, tiempo: 0 };
        }
        if (current.Count) {
            acc[name].cantidad += current.Count;
        }
        if (current["Tiempo "]) {
            acc[name].tiempo += convertTimeToSeconds(current["Tiempo "]);
        }
        return acc;
    }, {});
    
    function convertSecondsToTimeFormat(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
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
    const result = Object.values(groupData).map(item => {
        return {
            Item: item.Item,
            Cantidades: item.cantidad,
            Tiempo: convertSecondsToTimeFormat(item.tiempo)
        };
    });
    console.log(result)

    const clearFilter = () => {
        initFilter();
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const initFilter = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            Item: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            Count: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilterValue('');
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" outlined onClick={clearFilter} />
                <Link to={`/addItem/${proj}`}>Añadir pieza</Link>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="       Busqueda" />
                </IconField>
            </div>
        );
    }
    const numberFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
    };

    const header = renderHeader();
    return (
        <div className="container">
            <h2 className=".main-title font-bold text-xl">{`${toCapital(titulo)}${proj}`}</h2>
            <div className="card">
                <DataTable value={result} paginator showGridlines rows={10} loading={loading} dataKey={result.Item}
                    filters={filters} globalFilterFields={['Item', 'Count']} header={header}
                    emptyMessage="No customers found.">
                    <Column field="Item" header="Pieza" filter filterPlaceholder="Busqueda de pieza" style={{ minWidth: '12rem' }} />
                    <Column field="Cantidades" header="Cantidad de Piezas Maquinadas" filter filterPlaceholder="Cantidad" style={{ minWidth: '12rem' }} filterElement={numberFilterTemplate} />
                    <Column field="Tiempo" header="Tiempo (hh:mm:ss)" filter filterPlaceholder="Tiempo" style={{ minWidth: '12rem' }} filterElement={numberFilterTemplate} />
                </DataTable>
            </div>
        </div>
    )
}

export default DetailProjectContainer;