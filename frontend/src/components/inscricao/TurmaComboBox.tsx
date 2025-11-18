import { useQuery } from "@tanstack/react-query";
import { fetchTurmasPorDisciplina } from "../../api/api";
import { useInscricaoStore } from "../../store/useInscricaoStore";

const TurmaComboBox = () => {
  const { selectedDisciplinaId, selectedTurmaId, setSelectedTurmaId, resetAluno } = useInscricaoStore();

  const { data: turmas } = useQuery({
    queryKey: ["turmas", selectedDisciplinaId],
    queryFn: () => fetchTurmasPorDisciplina(selectedDisciplinaId),
    enabled: !!selectedDisciplinaId, // Só busca se tiver disciplina selecionada
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTurmaId(e.target.value);
    resetAluno(); // Limpa seleção de aluno ao trocar turma
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