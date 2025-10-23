import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <main className="container-fluid">
        <Outlet /> {/* O conteúdo da página atual será renderizado aqui */}
      </main>
    </>
  );
};

export default Layout;