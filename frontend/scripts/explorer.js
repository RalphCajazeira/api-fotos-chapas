import { listarPastas, buscarCaminho } from "./folder.js";

export async function renderizarNavegacao(pastaAtualId, aoSelecionarPasta) {
  const navegacao = document.getElementById("navegacao");
  navegacao.innerHTML = "";

  const pastas = await listarPastas(pastaAtualId);
  const caminho = await buscarCaminho(pastaAtualId);

  const header = document.createElement("div");
  header.classList.add("breadcrumb");

  const btnInicio = document.createElement("button");
  btnInicio.textContent = "🏠 Início";
  btnInicio.onclick = () => aoSelecionarPasta(null);
  header.appendChild(btnInicio);

  if (caminho.length > 1) {
    const btnVoltar = document.createElement("button");
    btnVoltar.textContent = "🔙 Voltar";
    btnVoltar.onclick = () => {
      const anterior = caminho[caminho.length - 2];
      if (!anterior || anterior.id === undefined) {
        console.warn("⚠️ Botão voltar sem pasta anterior válida.");
        aoSelecionarPasta(null);
      } else {
        aoSelecionarPasta(anterior.id);
      }
    };
    header.appendChild(btnVoltar);
  }

  const pathSpan = document.createElement("div");
  pathSpan.classList.add("breadcrumb-path");

  caminho.forEach((pasta, index) => {
    const span = document.createElement("span");
    span.textContent = pasta.name;
    if (index !== caminho.length - 1) span.classList.add("breadcrumb-link");
    if (index !== 0) pathSpan.append(" / ");
    if (index !== caminho.length - 1) {
      span.onclick = () => aoSelecionarPasta(pasta.id);
    }
    pathSpan.appendChild(span);
  });

  header.appendChild(pathSpan);
  navegacao.appendChild(header);

  const lista = document.createElement("div");
  lista.classList.add("pastas");

  if (pastas.length === 0) {
    const vazio = document.createElement("div");
    vazio.classList.add("diretorio-vazio");
    vazio.textContent = "📂 Diretório vazio";
    lista.appendChild(vazio);
  } else {
    pastas.forEach((pasta) => {
      if (!pasta.id || typeof pasta.id !== "number") {
        console.warn("🚫 Pasta inválida ou sem ID:", pasta);
        return;
      }

      const item = document.createElement("div");
      item.classList.add("pasta-item");
      item.textContent = pasta.name;
      item.onclick = () => aoSelecionarPasta(pasta.id);
      lista.appendChild(item);
    });
  }

  navegacao.appendChild(lista);
}
