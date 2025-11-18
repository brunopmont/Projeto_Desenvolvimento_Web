import type { Aluno, Turma, Disciplina, Inscricao } from "../model/types";

// A URL base do seu backend Spring Boot
const API_URL = "http://localhost:8080";

/**
 * Busca a lista completa de todos os alunos.
 */
export const fetchAlunos = async (): Promise<Aluno[]> => {
  const res = await fetch(`${API_URL}/alunos`);
  if (!res.ok) throw new Error("Erro ao buscar alunos");
  return res.json();
};

/**
 * Busca a lista completa de todas as turmas.
 */
export const fetchTurmas = async (): Promise<Turma[]> => {
  const res = await fetch(`${API_URL}/turmas`);
  if (!res.ok) throw new Error("Erro ao buscar turmas");
  return res.json();
};

/**
 * Busca os dados de uma única turma específica pelo seu ID.
 * @param id O ID da turma a ser buscada.
 */
export const fetchTurmaById = async (id: string): Promise<Turma> => {
  const res = await fetch(`${API_URL}/turmas/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar detalhes da turma");
  return res.json();
};

// ... imports

export const fetchDisciplinas = async (): Promise<Disciplina[]> => {
    const res = await fetch(`${API_URL}/disciplinas`);
    return res.json();
};

export const fetchTurmasPorDisciplina = async (disciplinaId: string): Promise<Turma[]> => {
    const res = await fetch(`${API_URL}/turmas/disciplina/${disciplinaId}`);
    return res.json();
};

export const fetchAlunosNaoInscritos = async (turmaId: string): Promise<Aluno[]> => {
    const res = await fetch(`${API_URL}/alunos/nao-inscritos/${turmaId}`);
    return res.json();
};

export const fetchInscricoesPorTurma = async (turmaId: string): Promise<Inscricao[]> => {
    const res = await fetch(`${API_URL}/inscricoes/turma/${turmaId}`);
    return res.json();
};

// Criação de Inscrição
export const cadastrarInscricao = async (dados: { alunoId: number; turmaId: number }) => {
    const res = await fetch(`${API_URL}/inscricoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error("Erro ao inscrever aluno");
    return res.json();
};