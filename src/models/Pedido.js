import produto from "./Produto.js";


export default class Pedido {
  constructor() {
    this.itens = [];
  }

  adicionarItem(produto, quantidade) {
    this.itens.push({ produto, quantidade });
  }

  mostrarResumo() {
    console.log("\n🧾 RESUMO DO PEDIDO:");
    if (this.itens.length === 0) {
      console.log("Nenhum item adicionado ainda.");
      return;
    }

    let total = 0;
    this.itens.forEach((item, i) => {
      const subtotal = item.produto.preco * item.quantidade;
      console.log(`${i + 1}. ${item.produto.nome} x${item.quantidade} = R$ ${subtotal.toFixed(2)}`);
      total += subtotal;
    });

    console.log(`Total a pagar: R$ ${total.toFixed(2)}\n`);

  }
}
