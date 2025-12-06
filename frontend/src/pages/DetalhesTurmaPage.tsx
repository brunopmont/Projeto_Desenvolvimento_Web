import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useApi from "../hooks/useApi";
import type { Turma } from "../model/types";

const DetalhesTurmaPage = () => {
  const { id } = useParams();
  
  // Inicializa o hook
  const { recuperarPorId } = useApi<Turma>("/turmas");

  const {
    data: turma,
    isLoading,
    isError,
  } = useQuery<Turma, Error>({
    queryKey: ["turma", id],
    // Passa uma arrow function para chamar o recuperarPorId com o ID
    queryFn: () => recuperarPorId(id!), 
    enabled: !!id,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar detalhes da turma.</div>;
  if (!turma) return <div>Turma não encontrada.</div>;

  return (
    <>
      <div className="mb-4">
        <h5>Detalhes da Turma</h5>
        <hr className="mt-1" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <div className="fw-bold">Disciplina</div>
            <div>{turma.disciplina.nome}</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold">Ano/Período</div>
            <div>{turma.ano}/{turma.periodo}</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold">Professor</div>
            <div>{turma.professor.nome}</div>
          </div>

          <div className="mt-4">
            <h5 className="fw-bold">Alunos Inscritos</h5>
            {turma.inscricoes.length > 0 ? (
              <ul className="list-group">
                {turma.inscricoes.map((inscricao) => (
                  <li key={inscricao.id} className="list-group-item">
                    {inscricao.aluno.nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum aluno inscrito nesta turma.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalhesTurmaPage;