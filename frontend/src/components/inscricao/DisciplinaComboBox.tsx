import { useQuery } from "@tanstack/react-query";
import useApi from "../../hooks/useApi"; // <--- Importa o hook
import { useInscricaoStore } from "../../store/useInscricaoStore";
import type { Disciplina } from "../../model/types"; // <--- Importa o tipo

const DisciplinaComboBox = () => {
  const { selectedDisciplinaId, setSelectedDisciplinaId, resetTurmaEAluno } = useInscricaoStore();
  
  // Instancia o hook para o endpoint correto
  const { recuperar } = useApi<Disciplina>("/disciplinas");

  const { data: disciplinas } = useQuery({
    queryKey: ["disciplinas"],
    queryFn: recuperar, // <--- Usa a função do hook
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDisciplinaId(e.target.value);
    resetTurmaEAluno(); 
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