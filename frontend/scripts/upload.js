import { API_BASE_URL } from './config.js';
import { showMensagem, toggleLoading } from './ui.js';

export async function uploadFoto(pastaId) {
  const fileInput = document.getElementById("modal-file");
  const file = fileInput.files[0];
  if (!file) return showMensagem("Selecione uma imagem.");

  const nome = document.getElementById("modal-nome").value.trim();
  const comprimento = document.getElementById("modal-comprimento").value.trim();
  const largura = document.getElementById("modal-largura").value.trim();
  const codeInterno = document.getElementById("modal-codeInterno").value.trim();

  if (!nome || !comprimento || !largura) {
    return showMensagem("Preencha todos os campos obrigatórios.");
  }

  const formData = new FormData();
  formData.append("file", file, nome + ".jpg"); // renomeia imagem
  formData.append("nome", nome);
  formData.append("comprimento", comprimento);
  formData.append("largura", largura);
  formData.append("codigo", codeInterno);
  formData.append("parent_id", pastaId);

  toggleLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Erro no upload");

    showMensagem("Foto enviada com sucesso!");
    document.getElementById("modal-tirar-foto").classList.add("hidden");
  } catch (err) {
    showMensagem("Erro ao enviar foto.");
    console.error(err);
  } finally {
    toggleLoading(false);
  }
}
