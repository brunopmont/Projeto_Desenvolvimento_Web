import { useQuery } from "@tanstack/react-query";
import { fetchAlunos } from "../api/api"; // Importa a função de busca
import type { Aluno } from "../model/types";

const ListarAlunosPage = () => {
  // O React Query substitui o useState e o useEffect
  const {
    data: alunos, // 'data' é renomeado para 'alunos'
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["alunos"], // Uma chave única para identificar esta busca
    queryFn: fetchAlunos, // A função que realmente busca os dados
  });

  // React Query gerencia o estado de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // React Query gerencia o estado de erro
  if (isError) {
    return <div>Erro ao carregar alunos.</div>;
  }

  // O JSX (HTML) abaixo é praticamente o mesmo
  return (
    <div>
      <h3>Lista de Alunos</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {/* Adicionamos '?' para o caso de 'alunos' ainda não existir */}
          {alunos?.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarAlunosPage;