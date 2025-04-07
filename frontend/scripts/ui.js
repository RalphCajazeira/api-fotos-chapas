
export function showMensagem(msg) {
  const el = document.getElementById("mensagem");
  el.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 3000);
}

export function toggleLoading(show = true) {
  document.getElementById("loading").classList.toggle("hidden", !show);
}
