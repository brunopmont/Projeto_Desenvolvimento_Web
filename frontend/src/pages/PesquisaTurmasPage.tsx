import { useEffect, useState, useMemo } from "react";
import type { Turma, Aluno } from "../model/types";

// Trabalho feito por Raphael Mendes Miranda Fernandes e Bruno Porto Monteiro

// Quantos alunos exibir por página
const ALUNOS_POR_PAGINA = 5;

const PesquisaTurmasPage = () => {
  // Estado para guardar TODAS as turmas vindas da API
  const [todasAsTurmas, setTodasAsTurmas] = useState<Turma[]>([]);
  // Estado para o texto da caixa de pesquisa
  const [termoPesquisa, setTermoPesquisa] = useState("");
  // Estado para a turma que o usuário clicou
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  // Estado para controlar a página atual da tabela de alunos
  const [paginaAtual, setPaginaAtual] = useState(1);

  // 1. Busca todas as turmas da API *apenas uma vez* quando a página carrega
  useEffect(() => {
    fetch("http://localhost:8080/turmas")
      .then((res) => res.json())
      .then((data) => setTodasAsTurmas(data))
      .catch((err) => console.error("Erro ao buscar turmas:", err));
  }, []);

  // 2. Filtra as turmas (lado esquerdo) com base no termo de pesquisa
  const turmasFiltradas = useMemo(() => {
    if (!termoPesquisa) {
      return []; // Lista vazia se a pesquisa estiver vazia
    }
    return todasAsTurmas.filter((turma) =>
      turma.codigo.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  }, [termoPesquisa, todasAsTurmas]);

  // 3. Extrai a lista de alunos da turma selecionada
  const alunosDaTurma = useMemo(() => {
    return turmaSelecionada?.inscricoes.map((inscricao) => inscricao.aluno) || [];
  }, [turmaSelecionada]);

  // 4. Lógica de Paginação
  const totalPaginas = Math.ceil(alunosDaTurma.length / ALUNOS_POR_PAGINA);
  const alunosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ALUNOS_POR_PAGINA;
    const fim = inicio + ALUNOS_POR_PAGINA;
    return alunosDaTurma.slice(inicio, fim);
  }, [alunosDaTurma, paginaAtual]);

  // 5. Handlers de Eventos
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
            placeholder="Digite o código da turma (ex: A001)"
          />
        </div>
      </div>

      <hr />

      {/* Layout Principal: Lista de Turmas (Esquerda) e Alunos (Direita) */}
      <div className="row">
        {/* Coluna da Esquerda: Lista de Turmas */}
        <div className="col-md-3">
          <h5 className="mb-3">Turmas</h5>
          {/* Só exibe a lista se o usuário digitou algo */}
          {termoPesquisa.length > 0 && (
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
          {/* Só exibe a tabela se uma turma foi selecionada */}
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
              <table className="table table-striped table-bordered align-middle" style={{ tableLayout: "fixed", width: "100%" }}>
                <thead className="table-dark">
                  <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosPaginados.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.cpf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginação */}
              {totalPaginas > 1 && (
                <nav>
                  <ul className="pagination justify-content-center">
                    {/* Botão Anterior */}
                    <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePaginaChange(paginaAtual - 1)}>
                        &laquo;
                      </button>
                    </li>
                    {/* Números das Páginas */}
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => (
                      <li key={numPagina} className={`page-item ${paginaAtual === numPagina ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePaginaChange(numPagina)}>
                          {numPagina}
                        </button>
                      </li>
                    ))}
                    {/* Botão Próximo */}
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