import { criarPasta } from "./scripts/folder.js";
import { renderizarNavegacao } from "./scripts/explorer.js";

let pastaAtualId = null;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalCriarPasta");
  const btnCriar = document.getElementById("btnCriarPasta");
  const cancelar = document.getElementById("cancelarCriacao");
  const confirmar = document.getElementById("confirmarCriacao");
  const input = document.getElementById("inputNomePasta");

  let bloqueado = false;

  const atualizar = async () => {
    await renderizarNavegacao(pastaAtualId, (novaId) => {
      pastaAtualId = novaId;
      atualizar();
    });
  };

  atualizar();

  btnCriar.addEventListener("click", () => {
    modal.classList.remove("hidden");
    input.value = "";
    input.focus();
  });

  cancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmar.addEventListener("click", async () => {
    if (bloqueado) return;
    const name = input.value.trim();
    if (!name) return alert("Informe o nome da pasta.");

    bloqueado = true;
    confirmar.disabled = true;

    await criarPasta(name, pastaAtualId);
    await atualizar();

    confirmar.disabled = false;
    bloqueado = false;
    modal.classList.add("hidden");
  });
});
