import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Turma } from "../model/types";

const DetalhesTurmaPage = () => {
  const { id } = useParams(); // Pega o 'id' da URL (ex: /turmas/1)
  const [turma, setTurma] = useState<Turma | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/turmas/${id}`)
        .then((response) => response.json())
        .then((data) => setTurma(data))
        .catch((error) =>
          console.error("Erro ao buscar detalhes da turma:", error)
        );
    }
  }, [id]); 

  // Exibe uma mensagem de carregamento enquanto os dados não chegam
  if (!turma) {
    return <div>Carregando...</div>;
  }

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