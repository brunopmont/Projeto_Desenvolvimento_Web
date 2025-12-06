import useFetchWithAuth from "./useFetchWithAuth";

const URL_BASE = "http://localhost:8080";

// T é o tipo do dado (ex: Aluno, Turma)
const useApi = <T>(endpoint: string) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const URL = `${URL_BASE}${endpoint}`;

  // Busca lista (GET /)
  const recuperar = async (): Promise<T[]> => {
    const response = await fetchWithAuth(URL);
    if (!response.ok) throw new Error("Erro ao recuperar dados");
    return response.json();
  };

  // Busca um item pelo ID (GET /id)
  const recuperarPorId = async (id: string | number): Promise<T> => {
    const response = await fetchWithAuth(`${URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao recuperar o registro");
    return response.json();
  };

  // Cria um novo registro (POST /)
  const cadastrar = async (dado: T): Promise<T> => {
    const response = await fetchWithAuth(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dado),
    });
    if (!response.ok) throw new Error("Erro ao cadastrar");
    return response.json();
  };

  // Remove um registro (DELETE /id)
  const remover = async (id: number | string): Promise<void> => {
    const response = await fetchWithAuth(`${URL}/${id}`, {
      method: "DELETE",
    });

    // CORREÇÃO: Lança erro se não for OK, independente de ser 403 ou 401.
    // Isso impede que o 'onSuccess' seja chamado no componente.
    if (!response.ok) {
        throw new Error("Erro ao remover registro");
    }
  };

  return { recuperar, recuperarPorId, cadastrar, remover };
};

export default useApi;