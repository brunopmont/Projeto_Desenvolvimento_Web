import useFetchWithAuth from "./useFetchWithAuth";

const URL_BASE = "http://localhost:8080";

const useApi = <T>(endpoint: string) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const URL = `${URL_BASE}${endpoint}`;

  const recuperar = async (): Promise<T[]> => {
    const response = await fetchWithAuth(URL);
    if (!response.ok) throw new Error("Erro ao recuperar dados");
    return response.json();
  };

  const recuperarPorId = async (id: string | number): Promise<T> => {
    const response = await fetchWithAuth(`${URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao recuperar o registro");
    return response.json();
  };

  const cadastrar = async (dado: T): Promise<T> => {
    const response = await fetchWithAuth(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dado),
    });
    if (!response.ok) throw new Error("Erro ao cadastrar");
    return response.json();
  };

  const remover = async (id: number | string): Promise<void> => {
    const response = await fetchWithAuth(`${URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
        // Cria um erro que carrega a resposta junto
        const error: any = new Error("Erro ao remover registro");
        error.response = response; 
        throw error;
    }
  };

  return { recuperar, recuperarPorId, cadastrar, remover };
};

export default useApi;