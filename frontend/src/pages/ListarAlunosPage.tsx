import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // <--- Importante para o botão funcionar
import useApi from "../hooks/useApi";
import type { Aluno } from "../model/types";
import useTokenStore from "../store/TokenStore"; // Para verificar permissão (opcional visualmente)

const ListarAlunosPage = () => {
  const { recuperar, remover } = useApi<Aluno>("/alunos");
  const queryClient = useQueryClient();
  
  // Verifica se é admin para mostrar o botão de Novo Aluno (Melhoria de UX)
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
      alert("Aluno removido!");
    },
    onError: (error) => console.log("Erro na mutação:", error),
  });

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar (Verifique se está logado).</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Alunos</h3>
        {/* Botão para cadastrar novo aluno */}
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
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (confirm("Tem certeza?")) {
                      mutationRemover.mutate(aluno.id);
                    }
                  }}
                >
                  Remover
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