import "bootstrap-icons/font/bootstrap-icons.min.css";
import { Link, useNavigate } from "react-router-dom";
import useTokenStore from "../store/TokenStore";

const NavBar = () => {
  const tokenResponse = useTokenStore((state) => state.tokenResponse);
  const logout = useTokenStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = tokenResponse.role === "ADMIN";
  const isLogged = !!tokenResponse.token;

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
          {/* Lado Esquerdo: Menus Principais */}
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/alunos">
              <i className="bi bi-person-lines-fill me-1"></i> Alunos
            </Link>

            {/* --- NOVO: Botão para Cadastrar Aluno (Só ADMIN) --- */}
            {isAdmin && (
              <Link className="nav-link" to="/cadastro-aluno">
                <i className="bi bi-person-plus-fill me-1"></i> Novo Aluno
              </Link>
            )}
            {/* --------------------------------------------------- */}

            <Link className="nav-link" to="/turmas">
              <i className="bi bi-card-list me-1"></i> Turmas
            </Link>
            <Link className="nav-link" to="/grupos">
              <i className="bi bi-people-fill me-1"></i> Gerenciar Grupos
            </Link>
            <Link className="nav-link" to="/pesquisa">
              <i className="bi bi-search me-1"></i> Pesquisa
            </Link>
            <Link className="nav-link" to="/inscricao">
              <i className="bi bi-pencil-square me-1"></i> Inscrição
            </Link>
            
            {/* Menu exclusivo para ADMIN: Criar novo usuário de sistema */}
            {isAdmin && (
              <Link className="nav-link text-warning" to="/cadastro-usuario">
                <i className="bi bi-shield-lock-fill me-1"></i> Criar Usuário
              </Link>
            )}
          </div>

          {/* Lado Direito: Login / Logout */}
          <div className="navbar-nav">
            {isLogged ? (
              <>
                <span className="nav-link text-light me-3">
                  Olá, <strong>{tokenResponse.nome}</strong> ({tokenResponse.role})
                </span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                  Sair
                </button>
              </>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;