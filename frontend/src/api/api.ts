import type { Aluno, Turma } from "../model/types";

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