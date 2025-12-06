import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TokenResponse } from "../interfaces/TokenResponse"; // Certifique-se de ter essa interface ou use 'any' por enquanto

interface TokenState {
  tokenResponse: TokenResponse;
  setTokenResponse: (response: TokenResponse) => void;
  logout: () => void;
}

const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      tokenResponse: { token: "", nome: "", role: "", idUsuario: 0 }, // Estado inicial vazio
      
      setTokenResponse: (response) => set({ tokenResponse: response }),
      
      logout: () => set({ 
        tokenResponse: { token: "", nome: "", role: "", idUsuario: 0 } 
      }),
    }),
    {
      name: "sistema-academico-token", // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTokenStore;