export function showMensagem(msg) {
  const el = document.getElementById("mensagem");
  el.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 3000);
}

export function toggleLoading(show = true) {
  document.getElementById("loading").classList.toggle("hidden", !show);
}

export function fecharModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.remove("active");
}


