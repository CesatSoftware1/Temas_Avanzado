import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { toCapital } from "../../toCapital";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";


const ViewProject = () => {

  const [proyectos, setProyectos] = useState([]);
  const [titulo] = useState("PROYECTOS");


  useEffect(() => {
    const productosRef = collection(db, "Proyectos");
    getDocs(productosRef)
      .then((resp) => {
        setProyectos(
          resp.docs.map((doc) => {
            return { ...doc.data(), id: doc.id }
          })
        )
      })
  }, [])

  return (
    <div>
      <div className="container">
        <h2 className=".main-title font-bold text-xl">{toCapital(titulo)}</h2>
        <div className="productos">
          {proyectos.map((proj) => <div className="producto">
            <div key={proj.id}>
              <h4>Proyecto: {proj.Proyecto}</h4>
              <p>Compañia: {toCapital(proj.Compañia)}</p>
              <Link className="ver-mas" to={`/project/${proj.Proyecto}`}>Ver más</Link>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default ViewProject