import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query"; 
import useApi from "../hooks/useApi"; // Importa useApi
import type { Turma } from "../model/types";

// Trabalho feito por Raphael Mendes Miranda Fernandes e Bruno Porto Monteiro

const ALUNOS_POR_PAGINA = 3; 

const PesquisaTurmasPage = () => {
  // 1. Configura o hook para buscar turmas
  const { recuperar } = useApi<Turma>("/turmas");

  // 2. Busca TODAS as turmas usando React Query e o recuperar do hook
  const { data: todasAsTurmas, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ["turmas"],
    queryFn: recuperar,
  });

  // Estados locais para controlar a UI
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Filtra as turmas (lado esquerdo)
  const turmasFiltradas = useMemo(() => {
    if (!termoPesquisa) {
      return [];
    }
    return (
      todasAsTurmas?.filter((turma) =>
        turma.codigo.toLowerCase().includes(termoPesquisa.toLowerCase())
      ) || []
    );
  }, [termoPesquisa, todasAsTurmas]);

  // Extrai a lista de alunos da turma selecionada
  const alunosDaTurma = useMemo(() => {
    return turmaSelecionada?.inscricoes.map((inscricao) => inscricao.aluno) || [];
  }, [turmaSelecionada]);

  // Lógica de Paginação
  const totalPaginas = Math.ceil(alunosDaTurma.length / ALUNOS_POR_PAGINA);
  const alunosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ALUNOS_POR_PAGINA;
    const fim = inicio + ALUNOS_POR_PAGINA;
    return alunosDaTurma.slice(inicio, fim);
  }, [alunosDaTurma, paginaAtual]);

  // Handlers de Eventos
  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoPesquisa(e.target.value);
    setTurmaSelecionada(null);
    setPaginaAtual(1); 
  };

  const handleTurmaClick = (turma: Turma) => {
    setTurmaSelecionada(turma);
    setPaginaAtual(1); 
  };

  const handlePaginaChange = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div>
      {/* Barra de Pesquisa */}
      <div className="mb-3 row">
        <label htmlFor="pesquisa" className="col-sm-2 col-form-label fw-bold">
          Pesquisa:
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            id="pesquisa"
            className="form-control"
            value={termoPesquisa}
            onChange={handlePesquisaChange}
            placeholder={
              isLoadingTurmas 
                ? "Carregando turmas..."
                : "Digite o código da turma (ex: A001)"
            }
            disabled={isLoadingTurmas}
          />
        </div>
      </div>

      <hr />

      {/* Layout Principal */}
      <div className="row">
        {/* Coluna da Esquerda: Lista de Turmas */}
        <div className="col-md-3">
          <h5 className="mb-3">Turmas</h5>
          {isLoadingTurmas && (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {termoPesquisa.length > 0 && !isLoadingTurmas && (
            <div className="list-group">
              {turmasFiltradas.length > 0 ? (
                turmasFiltradas.map((turma) => (
                  <button
                    key={turma.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      turmaSelecionada?.id === turma.id ? "active" : ""
                    }`}
                    onClick={() => handleTurmaClick(turma)}
                  >
                    {turma.codigo}
                  </button>
                ))
              ) : (
                <span className="list-group-item">Nenhuma turma encontrada.</span>
              )}
            </div>
          )}
        </div>

        {/* Coluna da Direita: Alunos da Turma Selecionada */}
        <div className="col-md-9">
          {turmaSelecionada ? (
            <>
              {/* Cabeçalho com Infos da Turma */}
              <div className="alert alert-secondary text-center p-2">
                <strong>Ano:</strong> {turmaSelecionada.ano}
                <strong className="ms-3">Período:</strong> {turmaSelecionada.periodo}º
                <strong className="ms-3">Disc:</strong> {turmaSelecionada.disciplina.nome}
                <strong className="ms-3">Prof:</strong> {turmaSelecionada.professor.nome}
              </div>

              {/* Tabela de Alunos */}
              <table
                className="table table-striped table-bordered align-middle"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "10%" }}>Id</th>
                    <th style={{ width: "30%" }}>Nome</th>
                    <th style={{ width: "35%" }}>Email</th>
                    <th style={{ width: "25%" }}>CPF</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosPaginados.map((aluno) => (
                    <tr key={aluno.id}>
                      <td className="text-truncate">{aluno.id}</td>
                      <td className="text-truncate">{aluno.nome}</td>
                      <td className="text-truncate">{aluno.email}</td>
                      <td className="text-truncate">{aluno.cpf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginação */}
              {totalPaginas > 1 && (
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePaginaChange(paginaAtual - 1)}>
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => (
                      <li key={numPagina} className={`page-item ${paginaAtual === numPagina ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePaginaChange(numPagina)}>
                          {numPagina}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePaginaChange(paginaAtual + 1)}>
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            termoPesquisa.length > 0 && (
              <div className="alert alert-info">
                Selecione uma turma na lista à esquerda para ver os alunos.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PesquisaTurmasPage;