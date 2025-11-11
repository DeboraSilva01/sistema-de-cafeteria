// Cardapio.js
import Produto from "./Produto.js";

// Array de produtos iniciais
const PRODUCTS = [
  { id: 1, name: 'Café Expresso', category: 'Café', priceCents: 450 },
  { id: 2, name: 'Cappuccino', category: 'Café', priceCents: 700 },
  { id: 3, name: 'Pão de Queijo', category: 'Salgado', priceCents: 300 },
  { id: 4, name: 'Bolo de Chocolate', category: 'Sobremesa', priceCents: 650 },
  { id: 5, name: 'Suco Natural', category: 'Bebida', priceCents: 625 },
  { id: 6, name: 'Teste', category: 'Bebida', priceCents: 1050 }
];

export default class Cardapio {
  constructor() {
    // Transformar cada item do PRODUCTS em instância de Produto
    this.produtos = PRODUCTS.map(
      p => new Produto(p.name, p.category, p.priceCents / 100) // converter cents para reais
    );
  }

  listarProdutos() {
    return this.produtos.map((p, i) => ({
      id: i + 1,
      nome: p.nome,
      categoria: p.categoria,
      preco: p.preco
    }));
  }

  listar() {
    return this.listarProdutos();
  }

  adicionar(nome, categoria = "Outros", preco) {
    const novo = new Produto(nome, categoria, preco);
    this.produtos.push(novo);
    const id = this.produtos.length;
    return { id, nome: novo.nome, categoria: novo.categoria, preco: novo.preco };
  }

  editar(id, nome, categoria, preco) {
    const idx = id - 1;
    if (idx < 0 || idx >= this.produtos.length) return null;
    const p = this.produtos[idx];
    if (typeof nome === "string") p.nome = nome;
    if (typeof categoria === "string") p.categoria = categoria;
    if (typeof preco === "number") p.preco = preco;
    return { id, nome: p.nome, categoria: p.categoria, preco: p.preco };
  }

  remover(id) {
    const idx = id - 1;
    if (idx < 0 || idx >= this.produtos.length) return false;
    this.produtos.splice(idx, 1);
    return true;
  }
}
