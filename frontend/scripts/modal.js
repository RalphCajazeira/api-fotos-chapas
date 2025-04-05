export function configurarModalCriarPasta(onConfirmar) {
  const modal = document.getElementById("modalCriarPasta");
  const btnPasta = document.getElementById("btnPasta");
  const cancelarBtn = document.getElementById("cancelarCriacao");
  const confirmarBtn = document.getElementById("confirmarCriacao");
  const input = document.getElementById("inputNomePasta");

  let bloqueado = false;

  btnPasta.addEventListener("click", () => {
    modal.classList.remove("hidden");
    input.value = "";
    input.focus();
  });

  cancelarBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmarBtn.addEventListener("click", async () => {
    if (bloqueado) return;
    const nome = input.value.trim();
    if (!nome) return alert("Informe o nome da pasta");

    bloqueado = true;
    confirmarBtn.disabled = true;

    await onConfirmar(nome);

    confirmarBtn.disabled = false;
    bloqueado = false;
    modal.classList.add("hidden");
  });
}
