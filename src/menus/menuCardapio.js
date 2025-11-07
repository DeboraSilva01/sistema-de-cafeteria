import { rl } from "../utils/input.js";

export default function mostrarMenuCardapio(cardapio, mostrarMenuPrincipal) {
  console.log("\n=== EDITAR CARDÁPIO ===");
  console.log("1. Adicionar produto");
  console.log("2. Editar produto existente");
  console.log("3. Remover produto");
  console.log("4. Voltar ao menu principal\n");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
      case "1":
        adicionarProdutoAoCardapio(cardapio, mostrarMenuCardapio, mostrarMenuPrincipal);
        break;
      case "2":
        editarProdutoDoCardapio(cardapio, mostrarMenuCardapio, mostrarMenuPrincipal);
        break;
      case "3":
        removerProdutoDoCardapio(cardapio, mostrarMenuCardapio, mostrarMenuPrincipal);
        break;
      case "4":
        mostrarMenuPrincipal();
        break;
      default:
        console.log("❌ Opção inválida!");
        mostrarMenuCardapio(cardapio, mostrarMenuPrincipal);
    }
  });
}

function adicionarProdutoAoCardapio(cardapio, mostrarMenuCardapio, mostrarMenuPrincipal) {
  rl.question("\nNome do produto: ", (nome) => {
    rl.question("Categoria: ", (categoria) => {
      rl.question("Preço: R$ ", (precoStr) => {
        const preco = parseFloat(precoStr);
        if (!isNaN(preco) && preco > 0) {
          cardapio.adicionarProduto(nome, categoria, preco);
        } else {
          console.log("❌ Preço inválido!");
        }
        mostrarMenuCardapio(cardapio, mostrarMenuPrincipal);
      });
    });
  });
}

function editarProdutoDoCardapio(cardapio, mostrarMenuCardapio, mostrarMenuPrincipal) {
  cardapio.listarProdutos();
  rl.question("\nDigite o número do produto a editar: ", (num) => {
    const indice = parseInt(num) - 1;
    if (indice >= 0 && indice < cardapio.produtos.length) {
      rl.question("Novo nome: ", (novoNome) => {
        rl.question("Nova categoria: ", (novaCategoria) => {
          rl.question("Novo preço: R$ ", (novoPrecoStr) => {
            const novoPreco = parseFloat(novoPrecoStr);
            if (!isNaN(novoPreco) && novoPreco > 0) {
              cardapio.editarProduto(indice, novoNome, novaCategoria, novoPreco);
            } else {
              console.log("❌ Preço inválido!");
            }
            mostrarMenuCardapio(cardapio, mostrarMenuPrincipal);
          });
        });
      });
    } else {
      console.log("❌ Produto não encontrado.");
      mostrarMenuCardapio(cardapio, mostrarMenuPrincipal);
    }
  });
}

function removerProdutoDoCardapio(cardapio, mostrarMenuCardapio, mostrarMenuPrincipal) {
  cardapio.listarProdutos();
  rl.question("\nDigite o número do produto a remover: ", (num) => {
    const indice = parseInt(num) - 1;
    cardapio.removerProduto(indice);
    mostrarMenuCardapio(cardapio, mostrarMenuPrincipal);
  });
}
