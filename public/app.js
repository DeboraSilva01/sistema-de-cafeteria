// === FILE: public/app.js ===

// Utilitário simples para selecionar elementos
const $ = (sel) => document.querySelector(sel);

// Referências DOM (compatíveis com o HTML existente)
const productsList = $("#productsList");
const cartList = $("#cartList");
const totalSpan = $("#total");
const subtotalSpan = $("#subtotal");
const overlay = $("#overlay");
const recBody = $("#recBody");
const recId = $("#recId");
const recDate = $("#recDate");
const btnEmitir = $("#btnEmitir");
const btnClear = $("#btnClear");
const btnClose = $("#btnClose");
const btnPrint = $("#btnPrint");

// Pagamento
const paymentMethods = document.getElementsByName("pay");
const cashBox = $("#cashBox");
const cashReceived = $("#cashReceived");
const changeInfo = $("#changeInfo");

const state = {
  cart: [],
  payment: null,
};

// === Carrega produtos do backend ===
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/cardapio");
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    const produtos = await res.json();

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
  const cartEmpty = $("#cartEmpty");

  if (state.cart.length === 0) {
    cartEmpty.style.display = "block";
    btnEmitir.disabled = true;
    btnClear.disabled = true;
  } else {
    cartEmpty.style.display = "none";
    btnEmitir.disabled = false;
    btnClear.disabled = false;
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
  subtotalSpan.textContent = `R$ ${total.toFixed(2)}`;
  totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

// === Limpar carrinho ===
function clearCart() {
  state.cart = [];
  renderCart();
  changeInfo.textContent = "";
  cashReceived.value = "";
}

// === Gerar nota (comprovante) ===
function emitirNota() {
  if (state.cart.length === 0) return alert("Carrinho vazio!");

  const pedidoId = Math.floor(Math.random() * 10000);
  const data = new Date().toLocaleString("pt-BR");

  const linhas = state.cart
    .map(
      (item) => `
      <tr>
        <td>${item.nome}</td>
        <td>R$ ${item.preco.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const total = state.cart.reduce((sum, item) => sum + item.preco, 0);

  recBody.innerHTML = `
    <table>
      <thead>
        <tr><th>Produto</th><th>Preço</th></tr>
      </thead>
      <tbody>${linhas}</tbody>
      <tfoot>
        <tr><td><strong>Total</strong></td><td><strong>R$ ${total.toFixed(2)}</strong></td></tr>
      </tfoot>
    </table>
    <p>Método de pagamento: <strong>${state.payment || "Não informado"}</strong></p>
  `;

  recId.textContent = "Pedido: " + pedidoId;
  recDate.textContent = data;

  overlay.setAttribute("aria-hidden", "false");
  overlay.style.display = "flex";
}

// === Fechar modal ===
function fecharNota() {
  overlay.style.display = "none";
  overlay.setAttribute("aria-hidden", "true");
}

// === Imprimir ou salvar PDF ===
function imprimirNota() {
  window.print();
}

// === Controle de pagamento ===
paymentMethods.forEach((input) => {
  input.addEventListener("change", () => {
    state.payment = input.value;

    if (input.value === "dinheiro") {
      cashBox.style.display = "block";
    } else {
      cashBox.style.display = "none";
      changeInfo.textContent = "";
    }
  });
});

// === Calcular troco ===
cashReceived.addEventListener("input", () => {
  const total = state.cart.reduce((sum, item) => sum + item.preco, 0);
  const recebido = parseFloat(cashReceived.value);
  if (isNaN(recebido)) return (changeInfo.textContent = "");

  const troco = recebido - total;
  if (troco < 0) {
    changeInfo.textContent = "Valor insuficiente.";
    changeInfo.style.color = "red";
  } else {
    changeInfo.textContent = `Troco: R$ ${troco.toFixed(2)}`;
    changeInfo.style.color = "green";
  }
});

// === Eventos dos botões ===
btnEmitir.addEventListener("click", emitirNota);
btnClear.addEventListener("click", clearCart);
btnClose.addEventListener("click", fecharNota);
btnPrint.addEventListener("click", imprimirNota);

// === Inicialização ===
document.addEventListener("DOMContentLoaded", loadProducts);
