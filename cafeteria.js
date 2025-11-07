import Cardapio from "./src/models/Cardapio.js";
import Pedido from "./src/models/Pedido.js";
import mostrarMenuPrincipal from "./src/menus/menuPrincipal.js";

// ===== CRIA CARDÁPIO PADRÃO =====
const cardapio = new Cardapio();

cardapio.adicionarProduto("Café Expresso", "Café", 4.5);
cardapio.adicionarProduto("Cappuccino", "Café", 7.0);
cardapio.adicionarProduto("Mocha", "Café", 8.5);
cardapio.adicionarProduto("Suco de Laranja", "Bebida", 6.0);
cardapio.adicionarProduto("Água Mineral", "Bebida", 3.0);
cardapio.adicionarProduto("Pão de Queijo", "Salgado", 3.0);
cardapio.adicionarProduto("Coxinha", "Salgado", 5.0);
cardapio.adicionarProduto("Bolo de Chocolate", "Sobremesa", 6.5);
cardapio.adicionarProduto("Torta de Limão", "Sobremesa", 7.0);

const pedido = new Pedido();

// ===== INÍCIO =====
mostrarMenuPrincipal(cardapio, pedido);
