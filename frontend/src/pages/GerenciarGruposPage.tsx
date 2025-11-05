import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query"; // Importa o useQuery
import { fetchTurmas, fetchTurmaById } from "../api/api"; // Importa as funções de busca
import type { Turma, Aluno } from "../model/types";

// Trabalho feito por Raphael Mendes Miranda Fernandes e Bruno Porto Monteiro

const GerenciarGruposPage = () => {
  // --- LÓGICA DE BUSCA DE DADOS (Refatorada com React Query) ---

  // Busca as turmas para o combo box (só roda uma vez)
  const { data: todasAsTurmas, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ["turmas"],
    queryFn: fetchTurmas,
  });

  // Estado para guardar o ID da turma que o usuário selecionou no combo box
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");

  // Busca os detalhes da turma escolhida.
  const { data: turmaSelecionada, isLoading: isLoadingDetalhes } = useQuery({
    queryKey: ["turma", selectedTurmaId], // A chave de query inclui o ID
    queryFn: () => fetchTurmaById(selectedTurmaId),
    enabled: !!selectedTurmaId,
  });

  // --- LÓGICA DO LOCALSTORAGE ---
  const [grupoAlunoIds, setGrupoAlunoIds] = useState<number[]>([]);

  const getGrupoDoLocalStorage = (codigoTurma: string): number[] => {
    const dados = localStorage.getItem(codigoTurma);
    return dados ? JSON.parse(dados) : [];
  };

  const saveGrupoNoLocalStorage = (codigoTurma: string, idsAlunos: number[]) => {
    localStorage.setItem(codigoTurma, JSON.stringify(idsAlunos));
  };

  // Efeito para carregar o localStorage depois que a tirma selecionada for buscada
  useEffect(() => {
    if (turmaSelecionada) {
      // Quando a query carregar os dados da turma, carregue o grupo do localStorage
      setGrupoAlunoIds(getGrupoDoLocalStorage(turmaSelecionada.codigo));
    } else {
      // Se nenhuma turma for selecionada, limpe o grupo
      setGrupoAlunoIds([]);
    }
  }, [turmaSelecionada]);

  // Handler do combo box
  // Ele apenas atualiza o ID, e o React Query cuida da busca
  const handleTurmaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTurmaId(event.target.value);
  };

  // Handler do botão "Incluir/Remover"
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

  // Função auxiliar (Permanece a mesma)
  const getAlunosDaTurma = (): Aluno[] => {
    return turmaSelecionada?.inscricoes.map((inscricao) => inscricao.aluno) || [];
  };

  const alunos = getAlunosDaTurma();

  // --- RENDERIZAÇÃO (JSX) ---
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
            disabled={isLoadingTurmas} 
          >
            <option value="">Selecione uma turma</option>
            {/* Usamos '?' para o caso de 'todasAsTurmas' ser undefined */}
            {todasAsTurmas?.map((turma) => (
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
          {/* Adiciona um feedback de carregamento */}
          {isLoadingDetalhes && (
            <tr>
              <td colSpan={4} className="text-center">
                Carregando alunos da turma...
              </td>
            </tr>
          )}

          {/* Renderiza os alunos quando não está carregando E uma turma foi selecionada */}
          {!isLoadingDetalhes &&
            turmaSelecionada &&
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