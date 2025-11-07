import express from "express";
import Cardapio from "../models/Cardapio.js";

const router = express.Router();
const cardapio = new Cardapio();

// listar produtos
router.get("/", (req, res) => {
  res.json(cardapio.listarProdutos());
});

// adicionar produto
router.post("/", (req, res) => {
  const { nome, categoria, preco } = req.body;
  if (!nome || typeof preco !== "number") {
    return res.status(400).json({ error: "nome e preco (number) obrigatórios" });
  }
  const novo = cardapio.adicionar(nome, categoria, preco);
  res.status(201).json(novo);
});

// editar produto
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, categoria, preco } = req.body;
  const edit = cardapio.editar(id, nome, categoria, preco);
  if (!edit) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(edit);
});

// remover produto
router.delete("/:id", (req, res) => {
  const removed = cardapio.remover(parseInt(req.params.id));
  if (!removed) return res.status(404).json({ error: "Produto não encontrado" });
  res.status(204).end();
});

export default router;
