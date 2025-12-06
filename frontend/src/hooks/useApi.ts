import useFetchWithAuth from "./useFetchWithAuth";

const URL_BASE = "http://localhost:8080";

// T é o tipo do dado (ex: Aluno, Turma)
const useApi = <T>(endpoint: string) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const URL = `${URL_BASE}${endpoint}`;

  const recuperar = async (): Promise<T[]> => {
    const response = await fetchWithAuth(URL);
    if (!response.ok) throw new Error("Erro ao recuperar dados");
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

  const remover = async (id: number): Promise<void> => {
    const response = await fetchWithAuth(`${URL}/${id}`, {
      method: "DELETE",
    });
    // Se for 403 ou 401, o fetchWithAuth já redirecionou.
    // Se for outro erro (500), lançamos aqui.
    if (!response.ok && response.status !== 403 && response.status !== 401) {
        throw new Error("Erro ao remover");
    }
  };

  return { recuperar, cadastrar, remover };
};

export default useApi;