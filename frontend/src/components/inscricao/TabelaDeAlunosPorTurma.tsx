import { useQuery } from "@tanstack/react-query";
import { fetchInscricoesPorTurma } from "../../api/api";
import { useInscricaoStore } from "../../store/useInscricaoStore";
import Paginacao from "./Paginacao";

const ITENS_POR_PAGINA = 5;

const TabelaDeAlunosPorTurma = () => {
  const { selectedTurmaId, termoPesquisa, paginaAtual } = useInscricaoStore();

  const { data: inscricoes, isLoading } = useQuery({
    queryKey: ["inscricoes-turma", selectedTurmaId],
    queryFn: () => fetchInscricoesPorTurma(selectedTurmaId),
    enabled: !!selectedTurmaId,
  });

  if (!selectedTurmaId) return <div className="alert alert-info">Selecione uma turma.</div>;
  if (isLoading) return <div>Carregando inscritos...</div>;

  // Filtragem em Memória
  const inscricoesFiltradas = inscricoes?.filter(i => 
    i.aluno.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  ) || [];

  // Paginação em Memória
  const totalItens = inscricoesFiltradas.length;
  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const dadosPaginados = inscricoesFiltradas.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <div className="border p-3">
      <div className="d-flex justify-content-between mb-3">
        <div><strong>Ano:</strong> 2025</div> {/* Idealmente viria da turma selecionada */}
        <div><strong>Período:</strong> 2</div>
      </div>
      
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID Inscrição</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
          </tr>
        </thead>
        <tbody>
          {dadosPaginados.map((inscricao) => (
            <tr key={inscricao.id}>
              <td>{inscricao.id}</td>
              <td>{inscricao.aluno.nome}</td>
              <td>{inscricao.aluno.email}</td>
              <td>{inscricao.aluno.cpf}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Paginacao totalPaginas={totalPaginas} />
    </div>
  );
};
export default TabelaDeAlunosPorTurma;