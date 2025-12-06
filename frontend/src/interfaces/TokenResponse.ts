export interface TokenResponse {
  token: string;
  idUsuario: number;
  nome: string;
  role: string; // "ADMIN" ou "USER"
}