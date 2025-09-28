import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Turma } from "../model/types";

const ListarTurmasPage = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/turmas")
      .then((response) => response.json())
      .then((data) => setTurmas(data))
      .catch((error) => console.error("Erro ao buscar turmas:", error));
  }, []);

  return (
    <div>
      <h3>Lista de Turmas</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Ano/Período</th>
            <th>Professor</th>
          </tr>
        </thead>
        <tbody>
          {turmas.map((turma) => (
            <tr key={turma.id}>
              <td>
                {/* Link para a página de detalhes da turma, passando o ID na URL */}
                <Link to={`/turmas/${turma.id}`}>{turma.disciplina.nome}</Link>
              </td>
              <td>
                {turma.ano}/{turma.periodo}
              </td>
              <td>{turma.professor.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTurmasPage;