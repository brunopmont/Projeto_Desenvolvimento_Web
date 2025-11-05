import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTurmas } from "../api/api"; // Importa a função de busca
import type { Turma } from "../model/types";

const ListarTurmasPage = () => {
  // Substitui useState e useEffect pelo useQuery
  const {
    data: turmas, // 'data' é renomeado para 'turmas'
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["turmas"], // Chave única para esta busca
    queryFn: fetchTurmas, // Função que busca os dados
  });

  // Gerencia o estado de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Gerencia o estado de erro
  if (isError) {
    return <div>Erro ao carregar turmas.</div>;
  }

  // O JSX (HTML) permanece o mesmo
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
          {/* Adicionamos '?' para o caso de 'turmas' ser undefined */}
          {turmas?.map((turma) => (
            <tr key={turma.id}>
              <td>
                {/* Link para a página de detalhes da turma, passando o ID na URL */}
                <Link to={`/turmas/${turma.id}`}>{turma.disciplina.nome}</Link>
              </td>
              <td>
                {turma.ano}/{turma.periodo}
              </td>
              <td>{turma.professor.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTurmasPage;