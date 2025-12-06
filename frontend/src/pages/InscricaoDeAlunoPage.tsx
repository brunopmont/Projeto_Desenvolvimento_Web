import { useQuery } from "@tanstack/react-query";
import InscricaoForm from "../components/inscricao/InscricaoForm";
import Pesquisa from "../components/inscricao/Pesquisa";
import TabelaDeAlunosPorTurma from "../components/inscricao/TabelaDeAlunosPorTurma";
import { useInscricaoStore } from "../store/useInscricaoStore";
import useApi from "../hooks/useApi"; // Importa o hook
import type { Inscricao } from "../model/types"; // Importe o tipo se necessário

const InscricaoDeAlunoPage = () => {
  const { selectedTurmaId } = useInscricaoStore();

  // Configura o useApi para apontar especificamente para as inscrições desta turma
  // Endpoint resultante: http://localhost:8080/inscricoes/turma/{id}
  const { recuperar } = useApi<Inscricao>(`/inscricoes/turma/${selectedTurmaId}`);

  const { data: inscricoes } = useQuery({
    queryKey: ["inscricoes-turma", selectedTurmaId],
    queryFn: recuperar, // Usa o recuperar do useApi
    enabled: !!selectedTurmaId,
  });

  const totalAlunos = inscricoes ? inscricoes.length : 0;

  return (
    <div className="container mt-4 border p-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h4 className="fw-bold">Inscrição de Aluno em Turma</h4>
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