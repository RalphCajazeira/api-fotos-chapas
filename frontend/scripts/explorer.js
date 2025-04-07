import { listarPastas, listarArquivos, buscarCaminho } from "./folder.js";

export async function renderizarNavegacao(pastaAtualId, aoSelecionarPasta) {
  const navegacao = document.getElementById("navegacao");
  navegacao.innerHTML = "";

  const pastas = await listarPastas(pastaAtualId);
  const arquivos = await listarArquivos(pastaAtualId);
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
      aoSelecionarPasta(anterior?.id || null);
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
  lista.classList.add("navegacao");

  if (pastas.length === 0 && arquivos.length === 0) {
    const vazio = document.createElement("div");
    vazio.classList.add("mensagem");
    vazio.textContent = "📂 Diretório vazio";
    lista.appendChild(vazio);
  }

  // 🟡 Pastas
  pastas.forEach((pasta) => {
    const item = document.createElement("div");
    item.classList.add("pasta-item");
    item.textContent = `📁 ${pasta.name}`;
    item.onclick = () => aoSelecionarPasta(pasta.id);
    lista.appendChild(item);
  });

  // 🟢 Arquivos (com preview)
  arquivos.forEach((arquivo) => {
    const item = document.createElement("div");
    item.classList.add("arquivo-item");

    const imagem = document.createElement("img");
    imagem.src = `https://drive.google.com/uc?id=${arquivo.drive_id}`;
    imagem.alt = arquivo.name;
    imagem.loading = "lazy";
    imagem.classList.add("arquivo-preview");

    const texto = document.createElement("div");
    texto.innerHTML = `<strong>${arquivo.name}</strong><br>${arquivo.width} x ${arquivo.height} - Cod. ${arquivo.internal_code}`;

    item.appendChild(imagem);
    item.appendChild(texto);
    lista.appendChild(item);
  });

  navegacao.appendChild(lista);
}
