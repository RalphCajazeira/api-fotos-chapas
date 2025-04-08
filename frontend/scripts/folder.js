import { API_BASE_URL } from "./config.js";
import { showMensagem } from "./ui.js";

// 📁 Criação de pasta
export async function criarPasta(name, parent_id = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parent_id }),
    });

    if (!response.ok) throw new Error("Erro ao criar pasta");

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("❌ Erro ao criar pasta:", error);
    showMensagem?.("Erro ao criar pasta. Verifique os dados.");
    return null;
  }
}

// 📁 Listagem de pastas
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
    console.error("❌ Erro ao buscar pastas:", error);
    return [];
  }
}

// 📂 Caminho até raiz
export async function buscarCaminho(id) {
  const caminho = [];

  if (id === undefined) {
    console.warn("⚠️ buscarCaminho recebeu 'undefined' como ID");
    return [{ id: null, name: "Raiz" }];
  }

  try {
    while (id !== null) {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`);
      if (!response.ok) break;

      const result = await response.json();
      caminho.unshift(result?.data || result);
      id = result?.data?.parent_id ?? result?.parent_id ?? null;
    }
  } catch (err) {
    console.error("❌ Erro ao montar caminho:", err);
  }

  caminho.unshift({ id: null, name: "Raiz" });
  return caminho;
}

// 📄 Listagem de arquivos da pasta
export async function listarArquivos(folder_id) {
  if (folder_id === null || folder_id === undefined) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/files/folder/${folder_id}`);
    if (!response.ok) throw new Error("Erro ao buscar arquivos");

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("❌ Erro ao buscar arquivos:", error);
    return [];
  }
}

// 🗑️ Excluir pasta
export async function excluirPasta(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir pasta");
    return true;
  } catch (error) {
    console.error("❌ Erro ao excluir pasta:", error);
    showMensagem("Erro ao excluir pasta.");
    return false;
  }
}

// ✏️ Renomear pasta (mantendo parent_id)
export async function renomearPasta(id, dados) {
  try {
    const resPasta = await fetch(`${API_BASE_URL}/folders/${id}`);
    if (!resPasta.ok) throw new Error("Erro ao buscar dados da pasta");

    const atual = await resPasta.json();
    const parent_id = atual?.data?.parent_id ?? null;

    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: dados.name, parent_id }),
    });

    if (!response.ok) throw new Error("Erro ao renomear pasta");
    return true;
  } catch (error) {
    console.error("❌ Erro ao renomear pasta:", error);
    showMensagem("Erro ao renomear pasta.");
    return false;
  }
}

// 🔀 Mover pasta (altera parent_id)
export async function moverPasta(id, parent_id) {
  try {
    const resPasta = await fetch(`${API_BASE_URL}/folders/${id}`);
    if (!resPasta.ok) throw new Error("Erro ao buscar dados da pasta");

    const atual = await resPasta.json();
    const name = atual?.data?.name;

    return await renomearPasta(id, { name, parent_id });
  } catch (err) {
    console.error("❌ Erro ao mover pasta:", err.message);
    showMensagem("Erro ao mover pasta.");
    return false;
  }
}
