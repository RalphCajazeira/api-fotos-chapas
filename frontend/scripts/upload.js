import { API_BASE_URL } from "./config.js";
import { showMensagem, toggleLoading } from "./ui.js";
import { atualizar } from "../index.js";

// 🧠 Formata número brasileiro com vírgula para ponto, e força 2 casas
function formatarNumero(valor) {
  const num = parseFloat((valor || "").replace(",", "."));
  return isNaN(num) ? null : num.toFixed(2);
}

export async function uploadFoto(pastaId) {
  const fileInput = document.getElementById("modal-file");
  const file = fileInput.files[0];

  const nome = document.getElementById("modal-nome").value.trim();
  const largura = formatarNumero(
    document.getElementById("modal-largura").value.trim()
  );
  const altura = formatarNumero(
    document.getElementById("modal-comprimento").value.trim()
  );
  const codigo = document.getElementById("modal-codeInterno").value.trim();

  // ✅ Apenas largura e altura são obrigatórios
  if (!file || !largura || !altura) {
    return showMensagem("Informe uma imagem, largura e altura corretamente.");
  }

  if (!pastaId) {
    return showMensagem("Você precisa estar dentro de uma pasta.");
  }

  const formData = new FormData();
  formData.append("file", file); // 1. arquivo
  formData.append("folder_id", pastaId); // 2. pasta
  if (nome) formData.append("name", nome); // 3. nome (opcional)
  formData.append("height", altura); // 4. altura (obrigatório)
  formData.append("width", largura); // 5. largura (obrigatório)
  if (codigo) formData.append("internal_code", codigo); // 6. código interno (opcional)

  console.log("📦 ENVIANDO FORM:", {
    file: file.name,
    folder_id: pastaId,
    height: altura,
    width: largura,
    name: nome,
    internal_code: codigo,
  });

  toggleLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: "POST",
      body: formData,
    });

    const texto = await response.text();
    console.log("📥 RESPOSTA:", texto);

    if (!response.ok) throw new Error("Erro no upload");

    showMensagem("📸 Upload realizado com sucesso!");

    // 🧼 Fecha modal e recarrega a pasta atual
    document.getElementById("modal-tirar-foto").classList.add("hidden");
    await atualizar(pastaId);
  } catch (err) {
    console.error("❌ uploadFoto ERRO:", err);
    showMensagem("Erro ao enviar a foto. Tente novamente.");
  } finally {
    toggleLoading(false);
  }
}
