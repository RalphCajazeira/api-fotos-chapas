import { API_BASE_URL } from "./config.js";

// Criação de pasta
export async function criarPasta(name, parent_id = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parent_id }),
    });

    if (!response.ok) throw new Error("Erro ao criar pasta");
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar pasta:", error);
    alert("Erro ao criar pasta.");
  }
}

// Listagem de pastas (com leitura correta de "data" do backend)
export async function listarPastas(parent_id = null) {
  const url = parent_id
    ? `${API_BASE_URL}/folders?parent_id=${parent_id}`
    : `${API_BASE_URL}/folders`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar pastas");

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Erro ao buscar pastas:", error);
    return [];
  }
}

// Monta caminho recursivo até a raiz
export async function buscarCaminho(id) {
  const caminho = [];

  if (id === undefined) {
    console.warn("⚠️ buscarCaminho recebeu 'undefined' como ID");
    return [{ id: null, name: "Raiz" }];
  }

  while (id !== null) {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`);
    if (!response.ok) break;

    const pasta = await response.json();
    caminho.unshift(pasta);
    id = pasta.parent_id;
  }

  caminho.unshift({ id: null, name: "Raiz" });
  return caminho;
}
