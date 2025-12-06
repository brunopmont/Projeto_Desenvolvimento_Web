import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useApi from "../hooks/useApi"; // Importa o hook
import type { Turma } from "../model/types";

const ListarTurmasPage = () => {
  // Inicializa o hook apontando para "/turmas"
  const { recuperar } = useApi<Turma>("/turmas");

  const {
    data: turmas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["turmas"],
    queryFn: recuperar, // Usa a função do hook
  });

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar turmas (Verifique se está logado).</div>;

  return (
    <div>
      <h3>Lista de Turmas</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Ano/Período</th>
            <th>Professor</th>
          </tr>
        </thead>
        <tbody>
          {turmas?.map((turma) => (
            <tr key={turma.id}>
              <td>
                <Link to={`/turmas/${turma.id}`}>{turma.disciplina.nome}</Link>
              </td>
              <td>{turma.ano}/{turma.periodo}</td>
              <td>{turma.professor.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTurmasPage;