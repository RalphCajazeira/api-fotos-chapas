
import { API_BASE_URL } from "./config.js";
import { showMensagem } from "./ui.js";

// Excluir arquivo por ID
export async function excluirArquivo(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir");

    return true;
  } catch (error) {
    console.error("❌ Erro ao excluir arquivo:", error);
    showMensagem("Erro ao excluir arquivo.");
    return false;
  }
}

// Renomear ou atualizar dados do arquivo
export async function renomearArquivo(id, dados) {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao renomear");

    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao renomear arquivo:", error);
    showMensagem("Erro ao renomear arquivo.");
    return null;
  }
}

// Mover para nova pasta (altera folder_id)
export async function moverArquivo(id, novoFolderId) {
  return await renomearArquivo(id, { folder_id: novoFolderId });
}
