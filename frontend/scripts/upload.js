import { API_BASE_URL } from "./config.js";
import { showMensagem, toggleLoading } from "./ui.js";

export async function uploadFoto(pastaId) {
  const fileInput = document.getElementById("modal-file");
  const file = fileInput.files[0];
  const nome = document.getElementById("modal-nome").value.trim();
  const largura = document.getElementById("modal-largura").value.trim();
  const altura = document.getElementById("modal-comprimento").value.trim();
  const codigo = document.getElementById("modal-codeInterno").value.trim();

  if (!file || !nome || !largura || !altura || !codigo) {
    return showMensagem("Preencha todos os campos e selecione uma imagem.");
  }

  if (!pastaId) {
    return showMensagem("Você precisa estar dentro de uma pasta.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder_id", pastaId);
  formData.append("name", nome);
  formData.append("width", largura);
  formData.append("height", altura);
  formData.append("internal_code", codigo);

  console.log("📦 ENVIANDO FORM:", {
    file,
    folder_id: pastaId,
    internal_code: codigo,
    width: largura,
    height: altura,
  });

  toggleLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    console.log("📥 RESPOSTA:", text);

    if (!response.ok) {
      throw new Error("Erro no upload");
    }

    showMensagem("Upload realizado com sucesso!");
    document.getElementById("modal-tirar-foto").classList.add("hidden");
  } catch (err) {
    console.error("❌ uploadFoto ERRO:", err);
    showMensagem("Erro ao enviar a foto. Tente novamente.");
  } finally {
    toggleLoading(false);
  }
}
