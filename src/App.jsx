import "./main.css";
import "./flag.css";

import DetailProjectContainer from "./components/piece/index"
import Login from "./components/auth/login";
import ViewProject from "./components/project/viewProject";
import AddProject from "./components/project/addProject";
import AddItem from "./components/piece/addItem";
import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  //const router = "/Cesat_Report"; // Si tu aplicación está en esta subruta
  const router = "/";

  const routesArray = [
    {
      path: `${router}`,
      element: <Login />,
    },
    {
      path:`${router}/project`,
      element: <ViewProject />
    },
    {
      path:`${router}/addproject`,
      element: <AddProject />
    },
    {
      path:`${router}/addItem/:Proyecto`,
      element: <AddItem />
    },
    {
      path:`${router}/project/:Proyecto`,
      element: <DetailProjectContainer />
    },
    {
      path: `${router}/login`,
      element: <Login />,
    },
    {
      path: `${router}/home`,
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
        <Header />
        <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
