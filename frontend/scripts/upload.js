
import { API_BASE_URL } from "./config.js";
import { showMensagem, toggleLoading, fecharModal } from "./ui.js";
import { renderizarNavegacao } from "./explorer.js";

export async function uploadFoto(pastaId, aoSelecionarPasta) {
  const fileInput = document.getElementById("modal-file");
  const file = fileInput.files[0];

  const nome = document.getElementById("modal-nome").value.trim();
  const largura = parseFloat(document.getElementById("modal-largura").value.replace(",", "."));
  const altura = parseFloat(document.getElementById("modal-comprimento").value.replace(",", "."));
  const codigo = document.getElementById("modal-codeInterno").value.trim();

  if (!file || isNaN(largura) || isNaN(altura)) {
    return showMensagem("Informe uma imagem, largura e altura corretamente.");
  }

  if (!pastaId) {
    return showMensagem("Você precisa estar dentro de uma pasta.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder_id", pastaId);
  if (nome) formData.append("name", nome);
  formData.append("height", altura.toFixed(2));
  formData.append("width", largura.toFixed(2));
  if (codigo) formData.append("internal_code", codigo);

  try {
    toggleLoading(true);
    const response = await fetch(`${API_BASE_URL}/file/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro no upload.");

    showMensagem("Upload feito com sucesso!");
    fecharModal();
    await renderizarNavegacao(pastaId, aoSelecionarPasta);
  } catch (error) {
    showMensagem("Erro: " + error.message);
  } finally {
    toggleLoading(false);
  }
}
