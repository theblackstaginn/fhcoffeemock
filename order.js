(() => {
  "use strict";

  // ====== MOCK PRODUCTS (edit freely) ======
  const PRODUCTS = [
    { id:"drip", name:"Drip Coffee", desc:"Simple. Honest. Hot or iced.", price:3.50, img:"./tiles/r-s-coffee.jpg" },
    { id:"americano", name:"Americano", desc:"Espresso + hot water. Clean bite.", price:4.00, img:"./tiles/espresso.jpg" },
    { id:"latte", name:"Latte", desc:"Smooth espresso with steamed milk.", price:5.25, img:"./tiles/espresso.jpg" },
    { id:"capp", name:"Cappuccino", desc:"Foam-forward, cozy and classic.", price:5.00, img:"./tiles/espresso.jpg" },
    { id:"coldbrew", name:"Cold Brew", desc:"Slow-steeped. Bold. Low acid.", price:4.75, img:"./tiles/r-s-coffee.jpg" },
    { id:"mocha", name:"Mocha", desc:"Chocolate + espresso. Comfort spell.", price:5.75, img:"./tiles/espresso.jpg" },
  ];

  const TAX_RATE = 0.07; // keep in sync with CSS note if you care

  // ====== STATE ======
  /** @type {Map<string, number>} */
  const cart = new Map();

  // ====== DOM ======
  const grid = document.getElementById("productGrid");
  const cartBtn = document.getElementById("cartBtn");
  const cartCount = document.getElementById("cartCount");

  const drawer = document.getElementById("drawer");
  const cartList = document.getElementById("cartList");
  const emptyCart = document.getElementById("emptyCart");

  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const placeOrderBtn = document.getElementById("placeOrder");
  const notesEl = document.getElementById("orderNotes");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // ====== UTIL ======
  const money = (n) => `$${n.toFixed(2)}`;
  const byId = (id) => PRODUCTS.find(p => p.id === id);

  function cartQtyTotal(){
    let t = 0;
    for (const q of cart.values()) t += q;
    return t;
  }

  function calcTotals(){
    let sub = 0;
    for (const [id, q] of cart.entries()){
      const p = byId(id);
      if (!p) continue;
      sub += p.price * q;
    }
    const tax = sub * TAX_RATE;
    const total = sub + tax;
    return { sub, tax, total };
  }

  // ====== RENDER PRODUCTS ======
  function renderProducts(){
    grid.innerHTML = "";
    for (const p of PRODUCTS){
      const qty = cart.get(p.id) || 0;

      const card = document.createElement("article");
      card.className = "card product";

      card.innerHTML = `
        <div class="product__top">
          <div class="product__img"><img src="${p.img}" alt="" loading="lazy"></div>
          <div class="product__meta">
            <div class="product__name">${p.name}</div>
            <div class="product__desc">${p.desc}</div>
            <div class="product__price">${money(p.price)}</div>
          </div>
        </div>

        <div class="product__actions">
          <div class="stepper" aria-label="Quantity stepper">
            <button type="button" data-dec="${p.id}" aria-label="Decrease">−</button>
            <span id="qty-${p.id}" aria-live="polite">${qty}</span>
            <button type="button" data-inc="${p.id}" aria-label="Increase">+</button>
          </div>

          <button class="btn addBtn" type="button" data-add="${p.id}">
            Add
          </button>
        </div>
      `;

      grid.appendChild(card);
    }
  }

  // ====== RENDER CART ======
  function renderCart(){
    const totalQty = cartQtyTotal();
    cartCount.textContent = String(totalQty);

    const { sub, tax, total } = calcTotals();
    subtotalEl.textContent = money(sub);
    taxEl.textContent = money(tax);
    totalEl.textContent = money(total);

    const isEmpty = totalQty === 0;
    emptyCart.hidden = !isEmpty;
    cartList.innerHTML = "";

    if (isEmpty) return;

    for (const [id, q] of cart.entries()){
      const p = byId(id);
      if (!p) continue;

      const row = document.createElement("div");
      row.className = "cartItem";
      row.innerHTML = `
        <div class="cartItem__meta">
          <div class="cartItem__name">${p.name}</div>
          <div class="cartItem__line">${q} × ${money(p.price)}</div>
        </div>
        <div class="cartItem__right">
          <div class="cartItem__price">${money(p.price * q)}</div>
          <button class="removeBtn" type="button" data-remove="${id}">Remove</button>
        </div>
      `;
      cartList.appendChild(row);
    }
  }

  function setQty(id, qty){
    qty = Math.max(0, Math.min(99, qty));
    if (qty === 0) cart.delete(id);
    else cart.set(id, qty);

    // Update grid qty label if present
    const span = document.getElementById(`qty-${id}`);
    if (span) span.textContent = String(cart.get(id) || 0);

    renderCart();
  }

  // ====== DRAWER ======
  function openDrawer(){
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeDrawer(){
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ====== MODAL (Menu / Hours / Order Summary) ======
  function openModal(title, html){
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(){
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ====== MOCK MENU / HOURS CONTENT ======
  // Coffee-only (Breakfast/Lunch removed)
  const MENU_HTML = `
    <div style="display:flex; flex-direction:column; gap:14px;">
      <div style="font-weight:900; font-size:18px;">Coffee</div>

      <div>
        <div style="font-weight:900; margin-bottom:6px;">House Coffee</div>
        <div style="display:grid; gap:6px;">
          <div>Drip Coffee <span style="float:right; font-weight:900;">$</span></div>
          <div>Cold Brew <span style="float:right; font-weight:900;">$</span></div>
        </div>
      </div>

      <div>
        <div style="font-weight:900; margin-bottom:6px;">Espresso</div>
        <div style="display:grid; gap:6px;">
          <div>Americano <span style="float:right; font-weight:900;">$</span></div>
          <div>Latte <span style="float:right; font-weight:900;">$</span></div>
          <div>Cappuccino <span style="float:right; font-weight:900;">$</span></div>
          <div>Mocha <span style="float:right; font-weight:900;">$</span></div>
        </div>
      </div>

      <div style="font-size:12px; color:rgba(17,18,20,.70);">
        (Mock pricing labels — replace with real prices when needed.)
      </div>
    </div>
  `;

  const HOURS_HTML = `
    <img class="hoursImg" src="./hours-panel.PNG" alt="Hours" style="width:100%; border-radius:16px; border:1px solid rgba(0,0,0,.08);" />
  `;

  // ====== EVENTS ======
  // Product grid clicks
  grid.addEventListener("click", (e) => {
    const t = e.target;

    const addId = t?.closest?.("[data-add]")?.getAttribute("data-add");
    if (addId){
      const cur = cart.get(addId) || 0;
      setQty(addId, cur + 1);
      return;
    }

    const incId = t?.closest?.("[data-inc]")?.getAttribute("data-inc");
    if (incId){
      const cur = cart.get(incId) || 0;
      setQty(incId, cur + 1);
      return;
    }

    const decId = t?.closest?.("[data-dec]")?.getAttribute("data-dec");
    if (decId){
      const cur = cart.get(decId) || 0;
      setQty(decId, cur - 1);
      return;
    }
  });

  // Cart open
  cartBtn.addEventListener("click", openDrawer);

  // Drawer close / remove
  drawer.addEventListener("click", (e) => {
    const t = e.target;

    if (t?.matches?.("[data-close]") || t?.closest?.("[data-close]")){
      closeDrawer();
      return;
    }

    const removeId = t?.closest?.("[data-remove]")?.getAttribute("data-remove");
    if (removeId){
      cart.delete(removeId);
      const span = document.getElementById(`qty-${removeId}`);
      if (span) span.textContent = "0";
      renderCart();
      return;
    }
  });

  // Modal close
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.matches?.("[data-close]") || t?.closest?.("[data-close]")){
      closeModal();
    }
  });

  // View Menu / Check Hours buttons (in intro)
  document.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("[data-open]");
    if (!btn) return;

    const which = btn.getAttribute("data-open");
    if (which === "menu") openModal("Menu", MENU_HTML);
    if (which === "hours") openModal("Hours", HOURS_HTML);
  });

  // Place order (mock) -> order summary
  placeOrderBtn.addEventListener("click", () => {
    const qtyTotal = cartQtyTotal();
    if (qtyTotal === 0){
      openModal("Order", `<div style="font-weight:900;">Cart is empty.</div><div class="muted">Add something first.</div>`);
      return;
    }

    const { sub, tax, total } = calcTotals();
    const lines = [];
    for (const [id, q] of cart.entries()){
      const p = byId(id);
      if (!p) continue;
      lines.push(`${q} × ${p.name} — ${money(p.price * q)}`);
    }

    const notes = (notesEl.value || "").trim();

    const summary = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="font-weight:900; font-size:18px;">Pickup Order Summary</div>
        <div style="padding:12px; border-radius:16px; background:rgba(0,0,0,.04); border:1px solid rgba(0,0,0,.06);">
          ${lines.map(l => `<div style="padding:4px 0;">${l}</div>`).join("")}
          <hr style="border:none; border-top:1px solid rgba(0,0,0,.10); margin:10px 0;">
          <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><strong>${money(sub)}</strong></div>
          <div style="display:flex; justify-content:space-between; color:rgba(17,18,20,.72); font-size:13px;"><span>Tax</span><span>${money(tax)}</span></div>
          <div style="display:flex; justify-content:space-between; font-size:18px;"><span><strong>Total</strong></span><strong>${money(total)}</strong></div>
        </div>

        ${notes ? `
          <div>
            <div style="font-weight:900; margin-bottom:6px;">Pickup notes</div>
            <div style="padding:10px 12px; border-radius:16px; background:rgba(255,255,255,.70); border:1px solid rgba(0,0,0,.08);">
              ${notes.replace(/</g,"&lt;").replace(/>/g,"&gt;")}
            </div>
          </div>
        ` : ""}

        <div style="font-size:12px; color:rgba(17,18,20,.70);">
          Mock only — in a real build this button would send to checkout or notify staff.
        </div>

        <button class="btn btn--primary" type="button" id="clearCartBtn">Clear cart</button>
      </div>
    `;

    closeDrawer();
    openModal("Order", summary);

    // Clear cart button inside modal
    setTimeout(() => {
      const clear = document.getElementById("clearCartBtn");
      if (clear){
        clear.addEventListener("click", () => {
          cart.clear();
          notesEl.value = "";
          renderProducts();
          renderCart();
          closeModal();
        });
      }
    }, 0);
  });

  // ====== INIT ======
  renderProducts();
  renderCart();

})();