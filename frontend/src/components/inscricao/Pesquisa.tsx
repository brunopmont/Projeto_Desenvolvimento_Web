import { useInscricaoStore } from "../../store/useInscricaoStore";

const Pesquisa = () => {
  const { termoPesquisa, setTermoPesquisa, setPaginaAtual } = useInscricaoStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoPesquisa(e.target.value);
    setPaginaAtual(1); // Reseta para a primeira página ao pesquisar
  };

  return (
    <div className="mb-3">
      <label className="fw-bold me-2">Pesquisa</label>
      <input 
        type="text" 
        className="form-control d-inline-block w-75" 
        placeholder="Informe o nome de um aluno"
        value={termoPesquisa}
        onChange={handleChange}
      />
    </div>
  );
};
export default Pesquisa;