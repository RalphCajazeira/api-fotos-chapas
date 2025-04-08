import {
  listarPastas,
  listarArquivos,
  buscarCaminho,
  excluirPasta,
  renomearPasta,
  moverPasta,
} from "./folder.js";
import { excluirArquivo } from "./file.js";

export async function renderizarNavegacao(pastaAtualId, aoSelecionarPasta) {
  const navegacao = document.getElementById("navegacao");
  navegacao.innerHTML = "";

  const pastas = await listarPastas();
  const arquivos = await listarArquivos(pastaAtualId);
  const caminho = await buscarCaminho(pastaAtualId);

  const pastasFiltradas = pastas.filter((p) => {
    if (pastaAtualId === null) return p.parent_id === null;
    return p.parent_id === pastaAtualId;
  });

  // Breadcrumb
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

  navegacao.appendChild(header);
  navegacao.appendChild(pathSpan);

  // Render pastas com botões de ações
  pastasFiltradas.forEach((pasta) => {
    const container = document.createElement("div");
    container.classList.add("pasta-item");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "space-between";

    const nomeBtn = document.createElement("button");
    nomeBtn.textContent = "📁 " + pasta.name;
    nomeBtn.onclick = () => aoSelecionarPasta(pasta.id);
    nomeBtn.style.flex = "1";
    nomeBtn.style.textAlign = "left";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "5px";

    const btnRename = document.createElement("button");
    btnRename.textContent = "✏️";
    btnRename.title = "Renomear";
    btnRename.onclick = async (e) => {
      e.stopPropagation();
      const novoNome = prompt("Novo nome da pasta:", pasta.name);
      if (novoNome && novoNome.trim()) {
        await renomearPasta(pasta.id, { name: novoNome });
        await renderizarNavegacao(pastaAtualId, aoSelecionarPasta);
      }
    };

    const btnMove = document.createElement("button");
    btnMove.textContent = "🔀";
    btnMove.title = "Mover para outra pasta";
    btnMove.onclick = async (e) => {
      e.stopPropagation();
      const destino = prompt(
        "ID da nova pasta-pai (deixe vazio para raiz):",
        pasta.parent_id ?? ""
      );
      if (destino !== null) {
        await moverPasta(pasta.id, destino === "" ? null : Number(destino));
        await renderizarNavegacao(pastaAtualId, aoSelecionarPasta);
      }
    };

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "🗑️";
    btnDelete.title = "Excluir pasta";
    btnDelete.onclick = async (e) => {
      e.stopPropagation();
      if (confirm("Deseja realmente excluir esta pasta?")) {
        await excluirPasta(pasta.id);
        await renderizarNavegacao(pastaAtualId, aoSelecionarPasta);
      }
    };

    actions.appendChild(btnRename);
    actions.appendChild(btnMove);
    actions.appendChild(btnDelete);

    container.appendChild(nomeBtn);
    container.appendChild(actions);
    navegacao.appendChild(container);
  });

  // Render arquivos
  arquivos.forEach((arquivo) => {
    const div = document.createElement("div");
    div.classList.add("file-item");

    const imagem = document.createElement("img");
    imagem.src = `https://drive.google.com/thumbnail?id=${arquivo.drive_id}`;
    imagem.alt = arquivo.name;
    imagem.referrerPolicy = "no-referrer";
    imagem.style.maxWidth = "150px";
    imagem.style.display = "block";
    imagem.style.marginBottom = "4px";

    const link = document.createElement("a");
    link.href = `https://drive.google.com/uc?export=download&id=${arquivo.drive_id}`;
    link.textContent = arquivo.name;
    link.download = arquivo.name;

    const excluirBtn = document.createElement("button");
    excluirBtn.textContent = "🗑️";
    excluirBtn.onclick = async () => {
      await excluirArquivo(arquivo.id);
      await renderizarNavegacao(pastaAtualId, aoSelecionarPasta);
    };

    div.appendChild(imagem);
    div.appendChild(link);
    div.appendChild(excluirBtn);
    navegacao.appendChild(div);
  });
}
