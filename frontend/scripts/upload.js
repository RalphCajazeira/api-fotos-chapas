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
  formData.append("file", file, nome + ".jpg");            // ✅ nome do arquivo
  formData.append("folder_id", pastaId);                   // ✅ ID da pasta (correto)
  formData.append("internal_code", codeInterno);           // ✅ Código interno
  formData.append("width", comprimento);                   // ✅ comprimento
  formData.append("height", largura);                      // ✅ largura

  // 🔍 Log para ver o que está sendo enviado
  console.log("📦 ENVIANDO FORM:", {
    file,
    folder_id: pastaId,
    internal_code: codeInterno,
    width: comprimento,
    height: largura,
  });

  toggleLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const responseText = await res.text(); // Captura a resposta como texto
    console.log("📥 RESPOSTA:", responseText); // 🔍 Mostra retorno

    if (!res.ok) throw new Error("Erro no upload");

    showMensagem("📸 Foto enviada com sucesso!");
    document.getElementById("modal-tirar-foto").classList.add("hidden");
  } catch (err) {
    showMensagem("Erro ao enviar foto.");
    console.error("❌ uploadFoto ERRO:", err);
  } finally {
    toggleLoading(false);
  }
}
