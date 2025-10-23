import { useEffect, useState } from "react";
import type { Aluno } from "../model/types";

const ListarAlunosPage = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/alunos")
      .then((response) => response.json())
      .then((data) => setAlunos(data))
      .catch((error) => console.error("Erro ao buscar alunos:", error));
  }, []); 

  return (
    <div>
      <h3>Lista de Alunos</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarAlunosPage;