import { showMensagem, toggleLoading } from "./scripts/ui.js";
import { API_BASE_URL } from "./scripts/config.js";
import { abrirModalFoto } from "./scripts/tirarFoto.js";
import { uploadFoto } from "./scripts/upload.js";

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
      atualizar(pastaAtualId);
    } catch {
      showMensagem("Erro ao criar pasta.");
    } finally {
      confirmar.disabled = false;
      toggleLoading(false);
    }
  };

  atualizar(null);
});

async function atualizar(pastaId) {
  pastaAtualId = pastaId;
  toggleLoading(true);
  try {
    const res = await fetch(
      pastaId !== null
        ? `${API_BASE_URL}/folders?parent_id=${pastaId}`
        : `${API_BASE_URL}/folders`
    );
    const dados = await res.json();
    let pastas = Array.isArray(dados.data) ? dados.data : [];

    // Filtro apenas quando estiver na raiz
    if (pastaId === null) {
      pastas = pastas.filter((p) => p.parent_id === null);
    }

    renderPastas(pastas);
    renderBreadcrumb(pastaId);
  } catch (e) {
    showMensagem("Erro ao carregar pastas.");
  } finally {
    toggleLoading(false);
  }
}

function renderPastas(pastas) {
  const area = document.getElementById("navegacao");
  area.innerHTML = "";

  if (pastas.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "pasta-item";
    vazio.textContent = "📂 Diretório vazio";
    area.appendChild(vazio);
  } else {
    pastas.forEach((pasta) => {
      const el = document.createElement("div");
      el.className = "pasta-item";
      el.textContent = `📁 ${pasta.name}`;
      el.onclick = () => atualizar(pasta.id);
      area.appendChild(el);
    });
  }

  // Garantia: sempre esconder carregando
  document.getElementById("loading").classList.add("hidden");
}

async function renderBreadcrumb(pastaId) {
  const bc = document.getElementById("breadcrumb");
  bc.innerHTML = "";
  const caminho = [];

  let atualId = pastaId;

  while (atualId !== null) {
    try {
      const res = await fetch(`${API_BASE_URL}/folders/${atualId}`);
      if (!res.ok) break;

      const pasta = await res.json();
      caminho.unshift(pasta);
      atualId = pasta.parent_id;
    } catch (error) {
      console.warn("Erro ao buscar caminho:", error);
      break;
    }
  }

  // Sempre incluir a raiz no início
  caminho.unshift({ id: null, name: "Início" });

  // Renderizar caminho
  caminho.forEach((pasta, index) => {
    const span = document.createElement("span");
    span.textContent = pasta.name;

    if (index !== caminho.length - 1) {
      span.className = "breadcrumb-link";
      span.onclick = () => atualizar(pasta.id);
      bc.appendChild(span);
      bc.append(" / ");
    } else {
      span.style.fontWeight = "bold";
      bc.appendChild(span);
    }
  });
}

btnFoto.onclick = () => abrirModalFoto();
document.getElementById("btnSalvarFoto").onclick = () =>
  uploadFoto(pastaAtualId);
