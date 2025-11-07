import Produto from "./Produto.js";

export default class Cardapio {
  constructor() {
    this.produtos = [];
  }

  adicionarProduto(nome, categoria, preco) {
    const produto = new Produto(nome, categoria, preco);
    this.produtos.push(produto);
    console.log(`✅ Produto "${nome}" adicionado com sucesso!`);
  }

  listarProdutos() {
    console.log("\n=== CARDÁPIO ===");
    if (this.produtos.length === 0) {
      console.log("Nenhum produto cadastrado.");
    } else {
      this.produtos.forEach((produto, index) => {
        console.log(`${index + 1}. ${produto.nome} - ${produto.categoria} - R$${produto.preco.toFixed(2)}`);
      });
    }
  }
}
