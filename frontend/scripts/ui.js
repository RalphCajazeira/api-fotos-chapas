export function showMensagem(msg) {
  alert(msg);
}

export function toggleLoading(isLoading) {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = isLoading ? "block" : "none";
}

export function fecharModal() {
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.add("hidden"));
}

export function abrirModalMover(pastaId, moverCallback, renderNavegacao) {
  const modal = document.getElementById("modal-mover");
  const conteudo = document.getElementById("modal-mover-content");
  conteudo.innerHTML = "";

  modal.classList.remove("hidden");

  let pastaAtualId = null;

  async function renderDestino(id) {
    pastaAtualId = id;

    // limpa conteúdo e renderiza botão + navegação
    conteudo.innerHTML = "";

    const moverBtn = document.createElement("button");
    moverBtn.textContent = "📦 Mover para aqui";
    moverBtn.style.marginBottom = "10px";
    moverBtn.onclick = async () => {
      await moverCallback(pastaId, pastaAtualId);
      fecharModal();
    };
    conteudo.appendChild(moverBtn);

    await renderNavegacao(pastaAtualId, renderDestino, conteudo);
  }

  renderDestino(null); // inicia na raiz
}
