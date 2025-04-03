const API_URL = "https://SEU-PROJETO.up.railway.app"; // substitua com sua URL real

document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    alert("✅ Upload realizado com ID: " + json.fileId);
  } catch (err) {
    console.error("Erro ao enviar:", err);
    alert("❌ Falha no envio. Veja o console.");
  }
};
