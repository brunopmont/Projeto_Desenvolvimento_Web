import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

// Importe os componentes de página que vamos criar a seguir
import ListarAlunosPage from "../pages/ListarAlunosPage";
import ListarTurmasPage from "../pages/ListarTurmasPage";
import DetalhesTurmaPage from "../pages/DetalhesTurmaPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // O Layout é o elemento pai de todas as rotas
    children: [
      { path: "alunos", element: <ListarAlunosPage /> },
      { path: "turmas", element: <ListarTurmasPage /> },
      // Esta rota captura um "id" da URL para a página de detalhes
      { path: "turmas/:id", element: <DetalhesTurmaPage /> },
    ],
  },
]);

export default router;