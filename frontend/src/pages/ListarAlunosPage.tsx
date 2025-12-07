import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import type { Aluno } from "../model/types";
import useTokenStore from "../store/TokenStore";

const ListarAlunosPage = () => {
  const { recuperar, remover } = useApi<Aluno>("/alunos");
  const queryClient = useQueryClient();
  
  const role = useTokenStore(s => s.tokenResponse.role);
  const isAdmin = role === 'ADMIN';

  const { data: alunos, isLoading, isError } = useQuery({
    queryKey: ["alunos"],
    queryFn: recuperar,
  });

  const mutationRemover = useMutation({
    mutationFn: (id: number) => remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      alert("Aluno removido com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro na remoção:", error);
      // Se for erro 409 (Conflito), mostra o aviso e NÃO sai da tela
      if (error.response && error.response.status === 409) {
          alert("Não é possível remover: O aluno possui associações (está em turmas).");
      } 
      // Se for ADMIN e tomou 403 (proibido), avisa e NÃO sai da tela
      else if (error.response && error.response.status === 403) {
           alert("Operação não permitida.");
      }
      // Se for outro erro, apenas avisa
      else {
          alert("Erro ao tentar remover.");
      }
    },
  });

  if (isLoading) return <div className="container mt-3">Carregando...</div>;
  if (isError) return <div className="container mt-3">Erro ao carregar dados.</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Alunos</h3>
        {isAdmin && (
            <Link to="/cadastro-aluno" className="btn btn-primary">
              Novo Aluno
            </Link>
        )}
      </div>

      <table className="table table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {alunos?.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>
                <button
                  type="button" // <--- IMPORTANTE: Evita submit automático
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.preventDefault(); // <--- IMPORTANTE: Evita recarregar a página
                    if (window.confirm(`Tem certeza que deseja remover o aluno ${aluno.nome}?`)) {
                      mutationRemover.mutate(aluno.id);
                    }
                  }}
                  disabled={mutationRemover.isPending}
                >
                  {mutationRemover.isPending ? "..." : "Remover"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarAlunosPage;