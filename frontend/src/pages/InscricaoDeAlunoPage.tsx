import { useQuery } from "@tanstack/react-query";
import InscricaoForm from "../components/inscricao/InscricaoForm";
import Pesquisa from "../components/inscricao/Pesquisa";
import TabelaDeAlunosPorTurma from "../components/inscricao/TabelaDeAlunosPorTurma";
import { useInscricaoStore } from "../store/useInscricaoStore";
import { fetchInscricoesPorTurma } from "../api/api";

const InscricaoDeAlunoPage = () => {
  // 1. Pegamos o ID da turma selecionada do Zustand
  const { selectedTurmaId } = useInscricaoStore();

  // 2. Usamos o React Query para buscar as inscrições e contar quantos alunos existem.
  // Nota: O React Query é inteligente. Se a Tabela lá embaixo já buscou esses dados,
  // ele usa o cache e não faz uma requisição duplicada desnecessária.
  const { data: inscricoes } = useQuery({
    queryKey: ["inscricoes-turma", selectedTurmaId],
    queryFn: () => fetchInscricoesPorTurma(selectedTurmaId),
    enabled: !!selectedTurmaId, // Só tenta buscar se tiver uma turma selecionada
  });

  // Se tiver inscrições, pega o tamanho. Se não, é 0.
  const totalAlunos = inscricoes ? inscricoes.length : 0;

  return (
    <div className="container mt-4 border p-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        {/* SOLUÇÃO 1: Trocamos "NavBar" pelo título correto */}
        <h4 className="fw-bold">Inscrição de Aluno em Turma</h4>
        
        {/* SOLUÇÃO 2: Exibimos o total dinâmico */}
        <h5 className="fw-bold">
          Total de alunos da turma: {selectedTurmaId ? totalAlunos : "-"}
        </h5>
      </div>
      
      <InscricaoForm />
      <hr className="border-3 border-dark my-4" />
      <Pesquisa />
      <TabelaDeAlunosPorTurma />
    </div>
  );
};

export default InscricaoDeAlunoPage;