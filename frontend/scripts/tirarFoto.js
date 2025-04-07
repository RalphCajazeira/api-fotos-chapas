export function abrirModalFoto() {
  const modal = document.getElementById("modal-tirar-foto");
  modal.classList.remove("hidden");
  document.getElementById("modal-file").value = "";
  document.getElementById("modal-nome").value = "";
  document.getElementById("modal-comprimento").value = "";
  document.getElementById("modal-largura").value = "";
  document.getElementById("modal-codeInterno").value = "";
}

export function fecharModalFoto() {
  document.getElementById("modal-tirar-foto").classList.add("hidden");
}
