export interface Aluno {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

export interface Professor {
  id: number;
  nome: string;
  email:string;
}

export interface Disciplina {
  id: number;
  nome: string;
  cargaHoraria: number;
}

export interface Inscricao {
  id: number;
  dataHora: string;
  aluno: Aluno;
}

export interface Turma {
  id: number;
  ano: number;
  codigo: string;
  periodo: number;
  professor: Professor;
  disciplina: Disciplina;
  inscricoes: Inscricao[];
}

