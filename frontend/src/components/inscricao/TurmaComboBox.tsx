import { useQuery } from "@tanstack/react-query";
import useApi from "../../hooks/useApi";
import { useInscricaoStore } from "../../store/useInscricaoStore";
import type { Turma } from "../../model/types";

const TurmaComboBox = () => {
  const { selectedDisciplinaId, selectedTurmaId, setSelectedTurmaId, resetAluno } = useInscricaoStore();

  // Endpoint dinâmico: /turmas/disciplina/{id}
  const { recuperar } = useApi<Turma>(`/turmas/disciplina/${selectedDisciplinaId}`);

  const { data: turmas } = useQuery({
    queryKey: ["turmas", selectedDisciplinaId],
    queryFn: recuperar,
    enabled: !!selectedDisciplinaId, 
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTurmaId(e.target.value);
    resetAluno(); 
  };

  return (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-bold">Turma:</label>
      <select 
        className="form-select" 
        value={selectedTurmaId} 
        onChange={handleChange}
        disabled={!selectedDisciplinaId}
      >
        <option value="">Selecione...</option>
        {turmas?.map((t) => (
          <option key={t.id} value={t.id}>{t.codigo} - {t.ano}/{t.periodo}</option>
        ))}
      </select>
    </div>
  );
};
export default TurmaComboBox;