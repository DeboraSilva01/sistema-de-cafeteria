import { rl } from "../utils/input.js";
import mostrarMenuCardapio from "./menuCardapio.js";

export default function mostrarMenuPrincipal(cardapio, pedido) {
  console.log("\n=== SISTEMA DA CAFETERIA ===");
  console.log("1. Ver cardápio");
  console.log("2. Adicionar item ao pedido");
  console.log("3. Ver resumo do pedido");
  console.log("4. Editar cardápio");
  console.log("5. Finalizar pedido e sair\n");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
      case "1":
        cardapio.listarProdutos();
        mostrarMenuPrincipal(cardapio, pedido);
        break;

      case "2":
        adicionarItemAoPedido(cardapio, pedido, mostrarMenuPrincipal);
        break;

      case "3":
        pedido.mostrarResumo();
        mostrarMenuPrincipal(cardapio, pedido);
        break;

      case "4":
        mostrarMenuCardapio(cardapio, () => mostrarMenuPrincipal(cardapio, pedido));
        break;

      case "5":
        pedido.mostrarResumo();
        console.log("👋 Obrigado por usar o sistema da cafeteria!");
        rl.close();
        break;

      default:
        console.log("❌ Opção inválida!");
        mostrarMenuPrincipal(cardapio, pedido);
    }
  });
}

function adicionarItemAoPedido(cardapio, pedido, mostrarMenuPrincipal) {
  cardapio.listarProdutos();
  rl.question("\nDigite o número do produto: ", (num) => {
    const indice = parseInt(num) - 1;
    if (indice >= 0 && indice < cardapio.produtos.length) {
      rl.question("Digite a quantidade: ", (qtd) => {
        const quantidade = parseInt(qtd);
        if (quantidade > 0) {
          pedido.adicionarItem(cardapio.produtos[indice], quantidade);
          console.log(`✅ Adicionado: ${quantidade}x ${cardapio.produtos[indice].nome}`);
        } else {
          console.log("❌ Quantidade inválida.");
        }
        mostrarMenuPrincipal(cardapio, pedido);
      });
    } else {
      console.log("❌ Produto inválido!");
      mostrarMenuPrincipal(cardapio, pedido);
    }
  });
}
