import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useApi from "../hooks/useApi"; // <--- Importa o hook
import type { Turma, Aluno } from "../model/types";

// Trabalho feito por Raphael Mendes Miranda Fernandes e Bruno Porto Monteiro

const GerenciarGruposPage = () => {
  // 1. Instancia o hook para turmas
  const { recuperar, recuperarPorId } = useApi<Turma>("/turmas");

  // Busca as turmas para o combo box
  const { data: todasAsTurmas, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ["turmas"],
    queryFn: recuperar, // <--- Usa a função do hook
  });

  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");

  // Busca os detalhes da turma escolhida
  const { data: turmaSelecionada, isLoading: isLoadingDetalhes } = useQuery({
    queryKey: ["turma", selectedTurmaId],
    // Usa recuperarPorId do hook
    queryFn: () => recuperarPorId(selectedTurmaId),
    enabled: !!selectedTurmaId,
  });

  // --- LÓGICA DO LOCALSTORAGE (Mantida Igual) ---
  const [grupoAlunoIds, setGrupoAlunoIds] = useState<number[]>([]);

  const getGrupoDoLocalStorage = (codigoTurma: string): number[] => {
    const dados = localStorage.getItem(codigoTurma);
    return dados ? JSON.parse(dados) : [];
  };

  const saveGrupoNoLocalStorage = (codigoTurma: string, idsAlunos: number[]) => {
    localStorage.setItem(codigoTurma, JSON.stringify(idsAlunos));
  };

  useEffect(() => {
    if (turmaSelecionada) {
      setGrupoAlunoIds(getGrupoDoLocalStorage(turmaSelecionada.codigo));
    } else {
      setGrupoAlunoIds([]);
    }
  }, [turmaSelecionada]);

  const handleTurmaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTurmaId(event.target.value);
  };

  const handleToggleAluno = (alunoId: number) => {
    if (!turmaSelecionada) return;

    const codigoTurma = turmaSelecionada.codigo;
    const grupoAtual = getGrupoDoLocalStorage(codigoTurma);
    let novoGrupo: number[];

    if (grupoAtual.includes(alunoId)) {
      novoGrupo = grupoAtual.filter((id) => id !== alunoId);
    } else {
      novoGrupo = [...grupoAtual, alunoId];
    }

    saveGrupoNoLocalStorage(codigoTurma, novoGrupo);
    setGrupoAlunoIds(novoGrupo);
  };

  const getAlunosDaTurma = (): Aluno[] => {
    return turmaSelecionada?.inscricoes.map((inscricao) => inscricao.aluno) || [];
  };

  const alunos = getAlunosDaTurma();

  // --- RENDERIZAÇÃO ---
  return (
    <div>
      <h3 className="mb-3">Gerenciar Grupos da Turma</h3>

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
            disabled={isLoadingTurmas} 
          >
            <option value="">Selecione uma turma</option>
            {todasAsTurmas?.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.codigo} - {turma.disciplina.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

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
          {isLoadingDetalhes && (
            <tr>
              <td colSpan={4} className="text-center">Carregando alunos da turma...</td>
            </tr>
          )}

          {!isLoadingDetalhes && turmaSelecionada && alunos.map((aluno) => {
              const estaNoGrupo = grupoAlunoIds.includes(aluno.id);
              return (
                <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${estaNoGrupo ? "btn-danger" : "btn-primary"}`}
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