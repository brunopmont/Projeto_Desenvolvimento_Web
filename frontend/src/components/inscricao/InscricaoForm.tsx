import { useMutation, useQueryClient } from "@tanstack/react-query";
import DisciplinaComboBox from "./DisciplinaComboBox";
import TurmaComboBox from "./TurmaComboBox";
import AlunoComboBox from "./AlunoComboBox";
import { useInscricaoStore } from "../../store/useInscricaoStore";
import { cadastrarInscricao } from "../../api/api";

const InscricaoForm = () => {
  const { selectedTurmaId, selectedAlunoId, setSelectedAlunoId } = useInscricaoStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: cadastrarInscricao,
    onSuccess: () => {
      // Atualiza as listas após a inscrição
      queryClient.invalidateQueries({ queryKey: ["alunos-nao-inscritos"] });
      queryClient.invalidateQueries({ queryKey: ["inscricoes-turma"] });
      setSelectedAlunoId(""); // Limpa o combo de aluno
      alert("Aluno inscrito com sucesso!");
    },
    onError: (error) => alert("Erro: " + error),
  });

  const handleInscrever = () => {
    if (selectedTurmaId && selectedAlunoId) {
      mutation.mutate({ 
        alunoId: Number(selectedAlunoId), 
        turmaId: Number(selectedTurmaId) 
      });
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5 className="card-title text-decoration-underline">Inscrição de Aluno em Turma</h5>
      <div className="row">
        <DisciplinaComboBox />
        <TurmaComboBox />
        <AlunoComboBox />
        <div className="col-md-12">
           <button 
             className="btn btn-dark" 
             onClick={handleInscrever}
             disabled={!selectedAlunoId || mutation.isPending}
           >
             {mutation.isPending ? "Inscrevendo..." : "Inscrever Aluno"}
           </button>
        </div>
      </div>
    </div>
  );
};
export default InscricaoForm;