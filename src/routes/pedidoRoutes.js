import express from "express";
const router = express.Router();

// memória simples de pedidos (poderia ser BD)
const pedidos = [];

// POST /api/pedido  — recebe pedido do frontend
router.post("/", (req, res) => {
  const pedido = req.body;
  // Validação básica
  if (!pedido || !pedido.id || !Array.isArray(pedido.items)) {
    return res.status(400).json({ error: "Pedido inválido" });
  }
  pedidos.push({ ...pedido, receivedAt: new Date().toISOString() });
  console.log("📦 Pedido recebido:", JSON.stringify(pedido, null, 2));
  // resposta
  res.json({ success: true, message: "Pedido recebido", orderId: pedido.id });
});

// GET /api/pedido  — listar pedidos (admin)
router.get("/", (req, res) => res.json(pedidos));

export default router;
