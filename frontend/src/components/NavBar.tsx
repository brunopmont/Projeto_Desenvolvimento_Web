import "bootstrap-icons/font/bootstrap-icons.min.css"; // [cite: 1]
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Sistema Acadêmico
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <Link className="nav-link" to="/alunos">
              <i className="bi bi-person-lines-fill me-1"></i> Alunos
            </Link>
            <Link className="nav-link" to="/turmas">
              <i className="bi bi-card-list me-1"></i> Turmas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;