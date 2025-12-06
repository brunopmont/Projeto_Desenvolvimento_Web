import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

// Importe os componentes de página que vamos criar a seguir
import ListarAlunosPage from "../pages/ListarAlunosPage";
import ListarTurmasPage from "../pages/ListarTurmasPage";
import DetalhesTurmaPage from "../pages/DetalhesTurmaPage";
import GerenciarGruposPage from "../pages/GerenciarGruposPage";
import PesquisaTurmasPage from "../pages/PesquisaTurmasPage";
import InscricaoDeAlunoPage from "../pages/InscricaoDeAlunoPage";
import CadastroDeAlunosPage from "../pages/CadastroDeAlunosPage";
import LoginPage from "../pages/LoginPage";
import CadastroDeUsuarioPage from "../pages/CadastroDeUsuarioPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "alunos", element: <ListarAlunosPage /> },
      { path: "turmas", element: <ListarTurmasPage /> },
      { path: "turmas/:id", element: <DetalhesTurmaPage /> },
      { path: "grupos", element: <GerenciarGruposPage /> },
      { path: "pesquisa", element: <PesquisaTurmasPage /> },
      { path: "inscricao", element: <InscricaoDeAlunoPage /> },
      { path: "cadastro-aluno", element: <CadastroDeAlunosPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "cadastro-usuario", element: <CadastroDeUsuarioPage /> },
    ],
  },
]);

export default router;