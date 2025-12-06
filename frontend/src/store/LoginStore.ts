import { create } from "zustand";

interface LoginState {
  mensagem: string;
  setMensagem: (msg: string) => void;
}

const useLoginStore = create<LoginState>((set) => ({
  mensagem: "",
  setMensagem: (msg) => set({ mensagem: msg }),
}));

export default useLoginStore;