import { useQuery } from "@tanstack/react-query";
import useApi from "../../hooks/useApi";
import { useInscricaoStore } from "../../store/useInscricaoStore";
import type { Aluno } from "../../model/types";

const AlunoComboBox = () => {
  const { selectedTurmaId, selectedAlunoId, setSelectedAlunoId } = useInscricaoStore();

  // Endpoint: /alunos/nao-inscritos/{turmaId}
  const { recuperar } = useApi<Aluno>(`/alunos/nao-inscritos/${selectedTurmaId}`);

  const { data: alunos } = useQuery({
    queryKey: ["alunos-nao-inscritos", selectedTurmaId],
    queryFn: recuperar,
    enabled: !!selectedTurmaId,
  });

  return (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-bold">Aluno:</label>
      <select 
        className="form-select" 
        value={selectedAlunoId} 
        onChange={(e) => setSelectedAlunoId(e.target.value)}
        disabled={!selectedTurmaId}
      >
        <option value="">Selecione...</option>
        {alunos?.map((a) => (
          <option key={a.id} value={a.id}>{a.nome}</option>
        ))}
      </select>
    </div>
  );
};
export default AlunoComboBox;