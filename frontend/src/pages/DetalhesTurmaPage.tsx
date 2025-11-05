import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTurmaById } from "../api/api"; // Importa a função de busca
import type { Turma } from "../model/types";

const DetalhesTurmaPage = () => {
  const { id } = useParams(); // Pega o 'id' da URL

  // Substitui useState e useEffect pelo useQuery
  const {
    data: turma,
    isLoading,
    isError,
  } = useQuery<Turma, Error>({
    // A chave de query é um array que inclui o 'id'.
    // Se o 'id' mudar, o React Query busca os dados novamente.
    queryKey: ["turma", id],
    
    // A função que será executada para buscar os dados
    queryFn: () => fetchTurmaById(id!), // O '!' diz ao TypeScript que 'id' não será nulo
    
    // 'enabled: !!id' garante que a query só execute se o 'id' existir (não for nulo)
    enabled: !!id,
  });

  // O React Query gerencia o estado de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // O React Query gerencia o estado de erro
  if (isError) {
    return <div>Erro ao carregar detalhes da turma.</div>;
  }

  // Se a query terminar e não houver dados (ex: ID não existe)
  if (!turma) {
    return <div>Turma não encontrada.</div>;
  }

  // O JSX (HTML) abaixo permanece o mesmo, pois 'turma'
  // é preenchido pelo React Query
  return (
    <>
      <div className="mb-4">
        <h5>Detalhes da Turma</h5>
        <hr className="mt-1" />
      </div>

      <div className="row">
        <div className="col-12">
          {/* Informações da Turma */}
          <div className="mb-3">
            <div className="fw-bold">Disciplina</div>
            <div>{turma.disciplina.nome}</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold">Ano/Período</div>
            <div>
              {turma.ano}/{turma.periodo}
            </div>
          </div>
          <div className="mb-3">
            <div className="fw-bold">Professor</div>
            <div>{turma.professor.nome}</div>
          </div>

          {/* Lista de Alunos Inscritos */}
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