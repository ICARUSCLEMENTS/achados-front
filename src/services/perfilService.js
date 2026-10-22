import api from "./api";

// GET - Buscar os dados do aluno
export async function buscarPerfil() {
  const resposta = await api.get("/eu");

  return resposta.data;
}