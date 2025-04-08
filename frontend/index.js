import { showMensagem, toggleLoading } from "./scripts/ui.js";
import { API_BASE_URL } from "./scripts/config.js";
import { abrirModalFoto } from "./scripts/tirarFoto.js";
import { uploadFoto } from "./scripts/upload.js";
import { renderizarNavegacao } from "./scripts/explorer.js";

let pastaAtualId = null;

document.addEventListener("DOMContentLoaded", () => {
  const btnHome = document.getElementById("btnHome");
  const btnCriar = document.getElementById("btnCriarPasta");
  const btnFoto = document.getElementById("btnFoto");
  const modal = document.getElementById("modalCriarPasta");
  const input = document.getElementById("inputNomePasta");
  const cancelar = document.getElementById("cancelarCriacao");
  const confirmar = document.getElementById("confirmarCriacao");

  btnHome.onclick = () => atualizar(null);

  btnCriar.onclick = () => {
    modal.classList.remove("hidden");
    input.value = "";
    input.focus();
  };

  cancelar.onclick = () => modal.classList.add("hidden");

  confirmar.onclick = async () => {
    const nome = input.value.trim();
    if (!nome) return showMensagem("Informe um nome válido.");
    confirmar.disabled = true;

    toggleLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, parent_id: pastaAtualId }),
      });

      if (!res.ok) throw new Error("Erro na criação");

      modal.classList.add("hidden");
      await atualizar(pastaAtualId);
    } catch {
      showMensagem("Erro ao criar pasta.");
    } finally {
      confirmar.disabled = false;
      toggleLoading(false);
    }
  };

  btnFoto.onclick = () => abrirModalFoto();
  document.getElementById("btnSalvarFoto").onclick = () =>
    uploadFoto(pastaAtualId);

  atualizar(null); // inicializa navegação
});

// ✅ Função principal para atualizar a navegação
export async function atualizar(pastaId = null) {
  pastaAtualId = pastaId;
  toggleLoading(true);
  try {
    await renderizarNavegacao(pastaAtualId, atualizar);
  } catch (e) {
    showMensagem("Erro ao carregar conteúdo.");
    console.error(e);
  } finally {
    toggleLoading(false);
  }
}
