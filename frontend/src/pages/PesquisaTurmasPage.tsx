import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query"; // Importa o useQuery
import { fetchTurmas } from "../api/api"; // Importa a função de busca
import type { Turma, Aluno } from "../model/types";

// Trabalho feito por Raphael Mendes Miranda Fernandes e Bruno Porto Monteiro

// Quantos alunos exibir por página
const ALUNOS_POR_PAGINA = 3; // Você pode ajustar este número

const PesquisaTurmasPage = () => {
  // 1. Busca TODAS as turmas usando React Query
  // Substitui o useState + useEffect + fetch
  const { data: todasAsTurmas, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ["turmas"],
    queryFn: fetchTurmas,
  });

  // 2. Estados locais para controlar a UI (isto permanece igual)
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // 3. Filtra as turmas (lado esquerdo) com base no termo de pesquisa
  // Esta lógica permanece a mesma, mas agora usa 'todasAsTurmas' do React Query
  const turmasFiltradas = useMemo(() => {
    if (!termoPesquisa) {
      return []; // Lista vazia se a pesquisa estiver vazia
    }
    return (
      todasAsTurmas?.filter((turma) =>
        turma.codigo.toLowerCase().includes(termoPesquisa.toLowerCase())
      ) || []
    );
  }, [termoPesquisa, todasAsTurmas]);

  // 4. Extrai a lista de alunos da turma selecionada (permanece igual)
  const alunosDaTurma = useMemo(() => {
    return turmaSelecionada?.inscricoes.map((inscricao) => inscricao.aluno) || [];
  }, [turmaSelecionada]);

  // 5. Lógica de Paginação (permanece igual)
  const totalPaginas = Math.ceil(alunosDaTurma.length / ALUNOS_POR_PAGINA);
  const alunosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ALUNOS_POR_PAGINA;
    const fim = inicio + ALUNOS_POR_PAGINA;
    return alunosDaTurma.slice(inicio, fim);
  }, [alunosDaTurma, paginaAtual]);

  // 6. Handlers de Eventos (permanecem iguais)
  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoPesquisa(e.target.value);
    setTurmaSelecionada(null); // Limpa a seleção de turma ao digitar
    setPaginaAtual(1); // Reseta a paginação
  };

  const handleTurmaClick = (turma: Turma) => {
    setTurmaSelecionada(turma);
    setPaginaAtual(1); // Reseta a paginação ao trocar de turma
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
              isLoadingTurmas // Adiciona feedback de carregamento
                ? "Carregando turmas..."
                : "Digite o código da turma (ex: A001)"
            }
            disabled={isLoadingTurmas} // Desabilita o input enquanto carrega
          />
        </div>
      </div>

      <hr />

      {/* Layout Principal: Lista de Turmas (Esquerda) e Alunos (Direita) */}
      <div className="row">
        {/* Coluna da Esquerda: Lista de Turmas */}
        <div className="col-md-3">
          <h5 className="mb-3">Turmas</h5>
          {/* Mostra um spinner enquanto as turmas carregam */}
          {isLoadingTurmas && (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {/* Só exibe a lista se o usuário digitou algo E não está carregando */}
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
          {/* O restante do JSX permanece igual, pois ele depende
              dos estados locais que não mudaram */}
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
                    {/* Botão Anterior */}
                    <li
                      className={`page-item ${
                        paginaAtual === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePaginaChange(paginaAtual - 1)}
                      >
                        &laquo;
                      </button>
                    </li>
                    {/* Números das Páginas */}
                    {Array.from(
                      { length: totalPaginas },
                      (_, i) => i + 1
                    ).map((numPagina) => (
                      <li
                        key={numPagina}
                        className={`page-item ${
                          paginaAtual === numPagina ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePaginaChange(numPagina)}
                        >
                          {numPagina}
                        </button>
                      </li>
                    ))}
                    {/* Botão Próximo */}
                    <li
                      className={`page-item ${
                        paginaAtual === totalPaginas ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePaginaChange(paginaAtual + 1)}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            // Mensagem se a pesquisa foi feita mas nenhuma turma foi selecionada
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