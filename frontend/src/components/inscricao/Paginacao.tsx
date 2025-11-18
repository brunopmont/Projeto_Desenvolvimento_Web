import { useInscricaoStore } from "../../store/useInscricaoStore";

interface Props { totalPaginas: number; }

const Paginacao = ({ totalPaginas }: Props) => {
  const { paginaAtual, setPaginaAtual } = useInscricaoStore();

  if (totalPaginas <= 1) return null;

  return (
    <div className="d-flex justify-content-center gap-2">
      <button 
        className="btn btn-outline-dark" 
        disabled={paginaAtual === 1}
        onClick={() => setPaginaAtual(paginaAtual - 1)}
      >
        &lt;
      </button>
      {[...Array(totalPaginas)].map((_, i) => (
        <button
          key={i}
          className={`btn ${paginaAtual === i + 1 ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setPaginaAtual(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button 
        className="btn btn-outline-dark" 
        disabled={paginaAtual === totalPaginas}
        onClick={() => setPaginaAtual(paginaAtual + 1)}
      >
        &gt;
      </button>
    </div>
  );
};
export default Paginacao;