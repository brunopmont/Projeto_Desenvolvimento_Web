import { useEffect, useState } from "react";
import type { Turma, Aluno } from "../model/types";

// Trabalho feito por Raphael Mendes Miranda Fernandes e Bruno Porto Monteiro

const GerenciarGruposPage = () => {
  const [todasAsTurmas, setTodasAsTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [grupoAlunoIds, setGrupoAlunoIds] = useState<number[]>([]);

  // Busca todas as turmas para preencher o combo box
  useEffect(() => {
    fetch("http://localhost:8080/turmas")
      .then((res) => res.json())
      .then((data) => setTodasAsTurmas(data))
      .catch((err) => console.error("Erro ao buscar turmas:", err));
  }, []);

  // Funções auxiliares para interagir com o LocalStorage
  const getGrupoDoLocalStorage = (codigoTurma: string): number[] => {
    const dados = localStorage.getItem(codigoTurma);
    return dados ? JSON.parse(dados) : [];
  };

  const saveGrupoNoLocalStorage = (codigoTurma: string, idsAlunos: number[]) => {
    localStorage.setItem(codigoTurma, JSON.stringify(idsAlunos));
  };

  // Função chamada quando o usuário seleciona uma turma no combo box
  const handleTurmaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const turmaId = event.target.value;

    if (!turmaId) {
      setTurmaSelecionada(null);
      setGrupoAlunoIds([]);
      return;
    }

    // Busca os dados completos da turma selecionada (incluindo inscrições)
    fetch(`http://localhost:8080/turmas/${turmaId}`)
      .then((res) => res.json())
      .then((turma: Turma) => {
        setTurmaSelecionada(turma);
        // Carrega o grupo de alunos do localStorage para esta turma
        setGrupoAlunoIds(getGrupoDoLocalStorage(turma.codigo));
      })
      .catch((err) => console.error("Erro ao buscar detalhes da turma:", err));
  };

  // Função chamada ao clicar em "Incluir" ou "Remover"
  const handleToggleAluno = (alunoId: number) => {
    if (!turmaSelecionada) return;

    const codigoTurma = turmaSelecionada.codigo;
    const grupoAtual = getGrupoDoLocalStorage(codigoTurma);
    let novoGrupo: number[];

    if (grupoAtual.includes(alunoId)) {
      // Remove o aluno do grupo
      novoGrupo = grupoAtual.filter((id) => id !== alunoId);
    } else {
      // Adiciona o aluno ao grupo
      novoGrupo = [...grupoAtual, alunoId];
    }

    // Salva o novo grupo no localStorage e atualiza o estado do React
    saveGrupoNoLocalStorage(codigoTurma, novoGrupo);
    setGrupoAlunoIds(novoGrupo);
  };

  // 5. Função para extrair a lista de Alunos de uma Turma
  const getAlunosDaTurma = (): Aluno[] => {
    return turmaSelecionada?.inscricoes.map((inscricao) => inscricao.aluno) || [];
  };

  const alunos = getAlunosDaTurma();

  return (
    <div>
      <h3 className="mb-3">Gerenciar Grupos da Turma</h3>

      {/* Combo Box para selecionar a Turma */}
      <div className="row mb-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="turma-select" className="form-label fw-bold">
            Turma
          </label>
        </div>
        <div className="col-4">
          <select
            id="turma-select"
            className="form-select"
            onChange={handleTurmaChange}
            defaultValue=""
          >
            <option value="">Selecione uma turma</option>
            {todasAsTurmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.codigo} - {turma.disciplina.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {/* Exibe a tabela apenas se uma turma estiver selecionada */}
          {turmaSelecionada &&
            alunos.map((aluno) => {
              const estaNoGrupo = grupoAlunoIds.includes(aluno.id);
              return (
                <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        estaNoGrupo ? "btn-danger" : "btn-primary"
                      }`}
                      onClick={() => handleToggleAluno(aluno.id)}
                      style={{ minWidth: "80px" }}
                    >
                      {estaNoGrupo ? "Remover" : "Incluir"}
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciarGruposPage;