const service = require("./chapa.service");

async function listarChapas(req, res) {
  const chapas = await service.getAll();
  res.json({ chapas });
}

async function buscarChapa(req, res) {
  const chapa = await service.getById(req.params.id);
  if (!chapa) return res.status(404).json({ error: "Chapa não encontrada" });
  res.json(chapa);
}

async function criarChapa(req, res) {
  try {
    const result = await service.create(req.file);
    res.json({ success: true, chapa: result });
  } catch (err) {
    console.error("❌ Erro ao criar chapa:", err);
    res.status(500).json({ error: "Erro ao salvar chapa" });
  }
}

async function removerChapa(req, res) {
  try {
    const sucesso = await service.remove(req.params.id);
    if (!sucesso)
      return res.status(404).json({ error: "Chapa não encontrada" });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erro ao remover chapa:", err);
    res.status(500).json({ error: "Erro ao deletar" });
  }
}

module.exports = {
  listarChapas,
  buscarChapa,
  criarChapa,
  removerChapa,
};
