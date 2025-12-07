import { useNavigate } from "react-router-dom";
import useTokenStore from "../store/TokenStore";
import useLoginStore from "../store/LoginStore";

export default function useFetchWithAuth() {
  const token = useTokenStore((state) => state.tokenResponse.token);
  const role = useTokenStore((state) => state.tokenResponse.role);
  
  const setMensagem = useLoginStore((state) => state.setMensagem);
  const navigate = useNavigate();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const newOptions = { ...options, headers };
    const response = await fetch(url, newOptions);

    if (response.status === 401) {
      setMensagem("Necessário estar autenticado.");
      navigate("/login");
    } 
    else if (response.status === 403) {
      // CORREÇÃO:
      // Se NÃO for ADMIN, redireciona para o login (regra do trabalho).
      // Se for ADMIN, não faz nada aqui, retorna o erro para a página tratar.
      if (role !== 'ADMIN') {
          setMensagem("Você não tem permissão para acessar este recurso.");
          navigate("/login");
      }
    }

    return response;
  };

  return { fetchWithAuth };
}