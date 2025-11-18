import { create } from 'zustand';

interface InscricaoState {
  selectedDisciplinaId: string;
  selectedTurmaId: string;
  selectedAlunoId: string;
  termoPesquisa: string;
  paginaAtual: number;

  setSelectedDisciplinaId: (id: string) => void;
  setSelectedTurmaId: (id: string) => void;
  setSelectedAlunoId: (id: string) => void;
  setTermoPesquisa: (termo: string) => void;
  setPaginaAtual: (pagina: number) => void;
  resetTurmaEAluno: () => void;
  resetAluno: () => void;
}

export const useInscricaoStore = create<InscricaoState>((set) => ({
  selectedDisciplinaId: "",
  selectedTurmaId: "",
  selectedAlunoId: "",
  termoPesquisa: "",
  paginaAtual: 1,

  setSelectedDisciplinaId: (id) => set({ selectedDisciplinaId: id }),
  setSelectedTurmaId: (id) => set({ selectedTurmaId: id }),
  setSelectedAlunoId: (id) => set({ selectedAlunoId: id }),
  setTermoPesquisa: (termo) => set({ termoPesquisa: termo }),
  setPaginaAtual: (pagina) => set({ paginaAtual: pagina }),

  // Reseta estados dependentes quando a disciplina muda
  resetTurmaEAluno: () => set({ selectedTurmaId: "", selectedAlunoId: "", termoPesquisa: "", paginaAtual: 1 }),
  // Reseta estado quando a turma muda
  resetAluno: () => set({ selectedAlunoId: "", termoPesquisa: "", paginaAtual: 1 }),
}));