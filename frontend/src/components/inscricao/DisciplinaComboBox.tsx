import { useQuery } from "@tanstack/react-query";
import { fetchDisciplinas } from "../../api/api";
import { useInscricaoStore } from "../../store/useInscricaoStore";

const DisciplinaComboBox = () => {
  const { selectedDisciplinaId, setSelectedDisciplinaId, resetTurmaEAluno } = useInscricaoStore();
  
  const { data: disciplinas } = useQuery({
    queryKey: ["disciplinas"],
    queryFn: fetchDisciplinas,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDisciplinaId(e.target.value);
    resetTurmaEAluno(); // Limpa turma e aluno ao trocar disciplina
  };

  return (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-bold">Disciplina:</label>
      <select className="form-select" value={selectedDisciplinaId} onChange={handleChange}>
        <option value="">Selecione...</option>
        {disciplinas?.map((d) => (
          <option key={d.id} value={d.id}>{d.nome}</option>
        ))}
      </select>
    </div>
  );
};
export default DisciplinaComboBox;