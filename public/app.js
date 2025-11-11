// === FILE: public/app.js ===

// Função utilitária para selecionar elementos
const $ = (sel) => document.querySelector(sel);

// Referências DOM (ajustadas conforme o HTML)
const productsList = $("#productsList"); // era #products
const cartList = $("#cartList");         // era #cart
const totalSpan = $("#total");

// Estado do carrinho
const state = {
  cart: [],
};

// === Função para carregar produtos do backend ===
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/cardapio");
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    const produtos = await res.json();

    // Renderiza os produtos no UL (productsList)
    productsList.innerHTML = produtos
      .map(
        (p) => `
        <li class="card">
          <h3>${p.nome}</h3>
          <p>Categoria: ${p.categoria}</p>
          <p>Preço: R$ ${p.preco.toFixed(2)}</p>
          <button onclick="addToCart(${p.id}, '${p.nome}', ${p.preco})">Adicionar</button>
        </li>
      `
      )
      .join("");
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

// === Adiciona produto ao carrinho ===
function addToCart(id, nome, preco) {
  state.cart.push({ id, nome, preco });
  renderCart();
}

// === Renderiza o carrinho ===
function renderCart() {
  if (state.cart.length === 0) {
    $("#cartEmpty").style.display = "block";
    $("#btnEmitir").disabled = true;
    $("#btnClear").disabled = true;
  } else {
    $("#cartEmpty").style.display = "none";
    $("#btnEmitir").disabled = false;
    $("#btnClear").disabled = false;
  }

  cartList.innerHTML = state.cart
    .map(
      (item) => `
      <li class="cart-item">
        ${item.nome} — R$ ${item.preco.toFixed(2)}
      </li>
    `
    )
    .join("");

  const total = state.cart.reduce((sum, item) => sum + item.preco, 0);
  totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

// === Inicialização ===
document.addEventListener("DOMContentLoaded", loadProducts);
