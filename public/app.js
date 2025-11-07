// FILE: app.js
(async function(){
  // --- dados do backend
const PRODUCTS = [

];

  // util
  const fmt = v => (v/100).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  const $ = sel => document.querySelector(sel);

  // estado local simples
  const state = { cart: [] };

  // DOM refs
  const productsList = $('#productsList');
  const cartList = $('#cartList');
  const cartEmpty = $('#cartEmpty');
  const subtotalEl = $('#subtotal');
  const totalEl = $('#total');
  const btnEmitir = $('#btnEmitir');
  const btnClear = $('#btnClear');

  const overlay = $('#overlay');
  const recBody = $('#recBody');
  const recId = $('#recId');
  const recDate = $('#recDate');
  const btnPrint = $('#btnPrint');
  const btnClose = $('#btnClose');

  // --- DOM refs adicionais
  const paymentMethodsEl = document.getElementById('paymentMethods');
  const cashBox = document.getElementById('cashBox');
  const cashReceivedInput = document.getElementById('cashReceived');
  const changeInfo = document.getElementById('changeInfo');

  // estado de pagamento
  state.payment = { method: null, cashReceivedCents: 0 };

  // --- Fetch produtos do backend
  async function loadProducts(){
    try {
      const res = await fetch('/api/cardapio');
      if(!res.ok) throw new Error('Falha ao carregar produtos');
      PRODUCTS = await res.json();
      renderProducts();
    } catch(err){
      console.error(err);
      productsList.innerHTML = '<li>Erro ao carregar produtos</li>';
    }
  }

  // listener: mudança da forma de pagamento
  if (paymentMethodsEl) {
    paymentMethodsEl.addEventListener('change', (e) => {
      const val = e.target.value;
      state.payment.method = val;
      if (val === 'dinheiro') cashBox.style.display = 'block';
      else {
        cashBox.style.display = 'none';
        cashReceivedInput.value = '';
        changeInfo.textContent = '';
        state.payment.cashReceivedCents = 0;
      }
      updateEmitButtonState();
    });
  }

  if (cashReceivedInput) {
    cashReceivedInput.addEventListener('input', (e) => {
      const v = Number(e.target.value) || 0;
      state.payment.cashReceivedCents = Math.round(v * 100);
      updateChangeInfo();
      updateEmitButtonState();
    });
  }

  function updateChangeInfo(){
    const totals = calcTotals();
    const received = state.payment.cashReceivedCents || 0;
    const diff = received - totals.subtotalCents;
    if(received <= 0){ changeInfo.textContent = ''; return; }
    changeInfo.textContent = diff < 0 
      ? `Faltam ${formatCents(-diff)} para cobrir o total.` 
      : `Troco: ${formatCents(diff)}.`;
  }

  function formatCents(cents){ return (cents/100).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }

  function updateEmitButtonState(){
    const hasItems = state.cart.length > 0;
    const hasMethod = !!state.payment.method;
    if(!hasItems || !hasMethod) { btnEmitir.disabled = true; return; }
    if(state.payment.method === 'dinheiro'){
      const totals = calcTotals();
      if((state.payment.cashReceivedCents || 0) < totals.subtotalCents){
        btnEmitir.disabled = true;
        return;
      }
    }
    btnEmitir.disabled = false;
  }

  function renderProducts(){
    productsList.innerHTML = '';
    for(const p of PRODUCTS){
      const li = document.createElement('li');
      li.className = 'product';
      li.innerHTML = `
        <div class="info">
          <div>
            <div class="name">${escapeHtml(p.nome)}</div>
<div class="cat">${escapeHtml(p.categoria)}</div>

          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div class="price">${fmt(Math.round(p.preco*100))}</div>
          <button class="btn btn-secondary" data-id="${p.id}">Adicionar</button>
        </div>
      `;
      productsList.appendChild(li);
    }
  }

  function findCartItem(id){ return state.cart.find(it => it.productId === id); }
  function addToCart(productId){
    const prod = PRODUCTS.find(p => p.id === productId);
    if(!prod) return;
    const existing = findCartItem(productId);
    if(existing) existing.qty += 1;
    else state.cart.push({ productId: prod.id, name: prod.nome, unitPriceCents: Math.round(prod.preco*100), qty: 1 });
    renderCart();
  }
  function removeFromCart(productId){ state.cart = state.cart.filter(it => it.productId !== productId); renderCart(); }
  function changeQty(productId, qty){ const it = findCartItem(productId); if(!it) return; it.qty = qty<=0?1:qty; renderCart(); }
  function calcTotals(){ return { subtotalCents: state.cart.reduce((sum,it)=>sum+it.unitPriceCents*it.qty,0) }; }

  function renderCart(){
    cartList.innerHTML = '';
    if(state.cart.length === 0){
      cartEmpty.style.display = 'block';
      btnEmitir.disabled = true;
      btnClear.disabled = true;
      subtotalEl.textContent = fmt(0);
      totalEl.textContent = fmt(0);
      updateEmitButtonState();
      return;
    }
    cartEmpty.style.display = 'none';
    btnEmitir.disabled = false;
    btnClear.disabled = false;

    for(const it of state.cart){
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div>
          <div class="name">${escapeHtml(it.name)}</div>
          <div class="qty muted">Qt: <input type="number" min="1" value="${it.qty}" data-id="${it.productId}" class="qty-input" style="width:68px"></div>
        </div>
        <div style="text-align:right">
          <div class="price">${fmt(it.unitPriceCents)}</div>
          <div style="margin-top:8px"><button class="btn btn-ghost remove-btn" data-id="${it.productId}">Remover</button></div>
        </div>
      `;
      cartList.appendChild(li);
    }

    const totals = calcTotals();
    subtotalEl.textContent = fmt(totals.subtotalCents);
    totalEl.textContent = fmt(totals.subtotalCents);
    updateEmitButtonState();
  }

  function buildOrder(){
    return {
      id: `PED-${Date.now()}`,
      date: new Date().toISOString(),
      paymentMethod: state.payment.method || null,
      cashReceivedCents: state.payment.cashReceivedCents || 0,
      items: state.cart.map(it => ({ id: it.productId, name: it.name, qty: it.qty, priceCents: it.unitPriceCents }))
    };
  }

  function openReceipt(){
    const order = buildOrder();
    const totals = calcTotals();
    recId.textContent = `Pedido: ${order.id}`;
    recDate.textContent = new Date(order.date).toLocaleString();

    let html = '<table><thead><tr><th>Produto</th><th>Qt</th><th>Preço</th><th>Subtotal</th></tr></thead><tbody>';
    for(const it of order.items){
      html += `<tr><td>${escapeHtml(it.name)}</td><td>${it.qty}</td><td style="text-align:right">${fmt(it.priceCents)}</td><td style="text-align:right">${fmt(it.priceCents * it.qty)}</td></tr>`;
    }
    html += `</tbody></table><div class="totals" style="margin-top:16px"><div style="display:flex;justify-content:space-between"><span>Subtotal</span><strong>${fmt(totals.subtotalCents)}</strong></div><div style="display:flex;justify-content:space-between;margin-top:10px"><span class="total">TOTAL</span><strong class="total">${fmt(totals.subtotalCents)}</strong></div></div>`;

    // pagamento
    const paymentHtmlParts = [];
    if(order.paymentMethod){
      let pmLabel = '';
      if(order.paymentMethod === 'dinheiro') pmLabel = 'Dinheiro';
      if(order.paymentMethod === 'cartao') pmLabel = 'Cartão';
      if(order.paymentMethod === 'pix') pmLabel = 'PIX';
      if(order.paymentMethod === 'vale') pmLabel = 'Vale';
      paymentHtmlParts.push(`<div style="margin-top:12px"><strong>Pagamento:</strong> ${pmLabel}</div>`);
      if(order.paymentMethod === 'dinheiro'){
        paymentHtmlParts.push(`<div><strong>Valor recebido:</strong> ${formatCents(order.cashReceivedCents)}</div>`);
        const change = (order.cashReceivedCents || 0) - totals.subtotalCents;
        paymentHtmlParts.push(`<div><strong>Troco:</strong> ${formatCents(Math.max(0, change))}</div>`);
      }
    }
    html += paymentHtmlParts.join('');
    recBody.innerHTML = html;
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeReceipt(){ overlay.setAttribute('aria-hidden','true'); }

  // eventos
  productsList.addEventListener('click', e => {
    const btn = e.target.closest('button[data-id]');
    if(!btn) return;
    addToCart(Number(btn.getAttribute('data-id')));
  });

  cartList.addEventListener('click', e => {
    const rem = e.target.closest('.remove-btn');
    if(rem){ removeFromCart(Number(rem.getAttribute('data-id'))); return; }
  });

  cartList.addEventListener('change', e => {
    const input = e.target.closest('.qty-input');
    if(!input) return;
    changeQty(Number(input.getAttribute('data-id')), Number(input.value));
  });

  btnClear.addEventListener('click', () => { state.cart = []; renderCart(); });
  btnEmitir.addEventListener('click', openReceipt);
  btnClose.addEventListener('click', closeReceipt);
  btnPrint.addEventListener('click', () => window.print());
  overlay.addEventListener('click', e => { if(e.target === overlay) closeReceipt(); });

  function escapeHtml(s){ return String(s).replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // init
  await loadProducts();
  renderCart();
})();
