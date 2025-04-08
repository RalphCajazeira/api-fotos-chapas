import { listarPastas, listarArquivos, buscarCaminho } from "./folder.js";
import { excluirArquivo } from "./file.js";

export async function renderizarNavegacao(pastaAtualId, aoSelecionarPasta) {
  const navegacao = document.getElementById("navegacao");
  navegacao.innerHTML = "";

  const pastas = await listarPastas(pastaAtualId);
  const arquivos = await listarArquivos(pastaAtualId);
  const caminho = await buscarCaminho(pastaAtualId);

  // 🔗 Breadcrumb
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

  // 🧾 Conteúdo (pastas + arquivos)
  const lista = document.createElement("div");
  lista.classList.add("navegacao");

  if (pastas.length === 0 && arquivos.length === 0) {
    const vazio = document.createElement("div");
    vazio.classList.add("mensagem");
    vazio.textContent = "📂 Diretório vazio";
    lista.appendChild(vazio);
  }

  pastas.forEach((pasta) => {
    const item = document.createElement("div");
    item.classList.add("pasta-item");
    item.textContent = `📁 ${pasta.name}`;
    item.onclick = () => aoSelecionarPasta(pasta.id);
    lista.appendChild(item);
  });

  arquivos.forEach((arquivo) => {
    const item = document.createElement("div");
    item.classList.add("arquivo-item");

    const imagem = document.createElement("img");
    imagem.src = `https://drive.google.com/thumbnail?id=${arquivo.drive_id}`;
    imagem.alt = arquivo.name;
    imagem.referrerPolicy = "no-referrer";

    // imagem.loading = "lazy";
    imagem.classList.add("arquivo-preview");

    const texto = document.createElement("div");
    texto.innerHTML = `<strong>${arquivo.name}</strong><br>${arquivo.width} x ${arquivo.height} - Cod. ${arquivo.internal_code}`;

    const botoes = document.createElement("div"); // ✅ declarado uma única vez
    botoes.classList.add("arquivo-actions");

    const btnRenomear = document.createElement("button");
    btnRenomear.textContent = "✏️ Renomear";
    btnRenomear.onclick = async () => {
      const novoNome = prompt("Novo nome:", arquivo.name);
      const novaLargura = prompt("Nova largura:", arquivo.width);
      const novaAltura = prompt("Nova altura:", arquivo.height);
      const novoCodigo = prompt("Novo código interno:", arquivo.internal_code);

      if (novoNome && novaLargura && novaAltura && novoCodigo) {
        const { renomearArquivo } = await import("./file.js");
        const atualizado = await renomearArquivo(arquivo.id, {
          name: novoNome,
          width: novaLargura,
          height: novaAltura,
          internal_code: novoCodigo,
        });
        if (atualizado) aoSelecionarPasta(pastaAtualId);
      }
    };

    const btnMover = document.createElement("button");
    btnMover.textContent = "📂 Mover";
    btnMover.onclick = async () => {
      const novoFolderId = prompt("ID da nova pasta:");
      if (novoFolderId && !isNaN(novoFolderId)) {
        const { moverArquivo } = await import("./file.js");
        const movido = await moverArquivo(arquivo.id, parseInt(novoFolderId));
        if (movido) aoSelecionarPasta(pastaAtualId);
      }
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️ Excluir";
    btnExcluir.onclick = async () => {
      if (confirm("Tem certeza que deseja excluir este arquivo?")) {
        const { excluirArquivo } = await import("./file.js");
        const ok = await excluirArquivo(arquivo.id);
        if (ok) aoSelecionarPasta(pastaAtualId);
      }
    };

    botoes.appendChild(btnRenomear);
    botoes.appendChild(btnMover);
    botoes.appendChild(btnExcluir);

    item.appendChild(imagem);
    item.appendChild(texto);
    item.appendChild(botoes);
    lista.appendChild(item);
  });

  navegacao.appendChild(lista);
}
