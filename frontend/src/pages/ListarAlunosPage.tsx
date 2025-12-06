import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "../hooks/useApi";
import type { Aluno } from "../model/types";

const ListarAlunosPage = () => {
  // 1. Usa o hook genérico especificando o tipo Aluno e o endpoint
  const { recuperar, remover } = useApi<Aluno>("/alunos");
  const queryClient = useQueryClient();

  // 2. React Query para buscar (GET)
  const { data: alunos, isLoading, isError } = useQuery({
    queryKey: ["alunos"],
    queryFn: recuperar,
  });

  // 3. React Query Mutation para remover (DELETE)
  const mutationRemover = useMutation({
    mutationFn: (id: number) => remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      alert("Aluno removido!");
    },
    // O erro 403 vai redirecionar antes de chegar aqui, mas é bom ter
    onError: (error) => console.log("Erro na mutação:", error),
  });

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar (Verifique se está logado).</div>;

  return (
    <div>
      <h3>Lista de Alunos</h3>
      <table className="table table-striped mt-3">
        <thead>
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
                {/* Botão visível para TODOS, mas falha para USER */}
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