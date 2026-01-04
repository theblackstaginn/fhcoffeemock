/* ===========================
   FARMHOUSE MOCK — APP
   - centered tile UI
   - modal content
   - menu data (from your screenshots only)
   - offline service worker
   =========================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const modal = $("#modal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");

  // Mock order link (replace later if you get a real URL)
  const ORDER_URL = "#";

  const MENU = [
    {
      id: "Signature Drinks",
      items: [
        { name: "Lavanilla", note: "Lavender/vanilla" },
        { name: "Twix", note: "Mocha/caramel" },
        { name: "Milky Way", note: "Caramel/white chocolate" },
        { name: "Nutella", note: "Mocha/hazelnut" },
        { name: "White Chocolate Raspberry", note: "" },
        { name: "Almond Joy", note: "Mocha/coconut/almond milk" },
        { name: "Michael Jackson", note: "Mocha/white chocolate" }
      ]
    },
    {
      id: "Cold Brew",
      items: [
        { name: "Cold Brew", note: "" },
        { name: "Nitro Cold Brew", note: "" }
      ]
    },
    {
      id: "Iced/Frozen",
      items: [
        { name: "Latte", note: "" }
      ]
    },
    {
      id: "Specialty",
      items: [
        { name: "Caramel", note: "" },
        { name: "Mocha", note: "" },
        { name: "Vanilla Dream", note: "" },
        { name: "White choc", note: "" }
      ]
    },
    {
      id: "Extras",
      items: [
        { name: "Extra Shot", note: "" },
        { name: "Syrup", note: "Vanilla, caramel, white choc, mocha, lavender, raspberry, coconut, toffee, hazelnut, sugar free: vanilla, caramel" },
        { name: "Alt Milk", note: "Oat, almond, coconut, soy" }
      ]
    },
    {
      id: "Hot",
      items: [
        { name: "Drip", note: "(Light, medium, dark)" },
        { name: "Americano", note: "" },
        { name: "Latte", note: "" }
      ]
    },
    {
      id: "Specialty Lattes",
      items: [
        { name: "Caramelatte", note: "" },
        { name: "Cafe Mocha Or White Chocolate", note: "" },
        { name: "Vanilla Dream", note: "" }
      ]
    },
    {
      id: "Kolaches",
      items: [
        { name: "Egg+Cheese", note: "" },
        { name: "Bacon & Cheese", note: "" },
        { name: "Plain", note: "" },
        { name: "Cheddar", note: "" }
      ]
    },
    {
      id: "Kids",
      items: [
        { name: "Honest Kids Organic", note: "" }
      ]
    },
    {
      id: "Tea+More",
      items: [
        { name: "London Fog", note: "(Vanilla or lavender)" },
        { name: "Chai Latte", note: "(Iced or hot)" },
        { name: "Morning Mist", note: "" }
      ]
    },
    {
      id: "Hot Teas",
      items: [
        { name: "Green", note: "" },
        { name: "Black", note: "" },
        { name: "Chai", note: "" },
        { name: "Earl Grey", note: "" },
        { name: "Peppermint", note: "" },
        { name: "Lavender", note: "" }
      ]
    },
    {
      id: "Others",
      items: [
        { name: "Cappuccino", note: "" },
        { name: "Macchiato", note: "" },
        { name: "Espresso (Double)", note: "" },
        { name: "Muffins", note: "" },
        { name: "Nutella Crepe", note: "" },
        { name: "Waffle", note: "" },
        { name: "Cinn. Roll", note: "" },
        { name: "French Toast Blueberry", note: "" },
        { name: "Kids' Juice", note: "" }
      ]
    }
  ];

  const CARDS = {
    hours: {
      title: "Hours",
      // NOTE: We keep the hours image only (full visible).
      html: `
        <div class="menuSection">
          <img
            src="hours-panel.PNG"
            alt="New hours panel"
            style="width:100%;height:auto;border-radius:18px;border:1px solid rgba(255,255,255,.10);display:block;"
          />
        </div>
      `
    },
    counter: {
      title: "Inside",
      html: `
        <div class="menuSection">
          <img src="counter.jpg" alt="Counter photo" style="width:100%;border-radius:18px;border:1px solid rgba(255,255,255,.10);display:block;" />
        </div>
      `
    },
    feature: {
      title: "Rise & Shine",
      html: `
        <div class="menuSection">
          <img src="r-s-coffee.jpg" alt="Rise and Shine coffee photo" style="width:100%;border-radius:18px;border:1px solid rgba(255,255,255,.10);display:block;" />
        </div>
      `
    },
    menu: {
      title: "Menu",
      html: buildMenuUI()
    }
  };

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildMenuUI() {
    const tabs = MENU.map((sec, i) => {
      const selected = i === 0 ? 'aria-selected="true"' : 'aria-selected="false"';
      return `<button class="menuTab" type="button" data-tab="${esc(sec.id)}" ${selected}>${esc(sec.id)}</button>`;
    }).join("");

    const sections = MENU.map((sec, i) => {
      const hidden = i === 0 ? "" : 'style="display:none"';
      const items = sec.items
        .map((it) => {
          const note = it.note ? `<div class="note">${esc(it.note)}</div>` : "";
          return `<div class="menuItem"><div class="name">${esc(it.name)}</div>${note}</div>`;
        })
        .join("");

      return `
        <div class="menuSection" data-section="${esc(sec.id)}" ${hidden}>
          <h3>${esc(sec.id)}</h3>
          ${items}
        </div>
      `;
    }).join("");

    // ✅ Changes:
    // - Remove the menu.jpg "Full Menu Image" block entirely.
    // - Add a single "Order Pickup" button at top (mock link).
    return `
      <div class="menuTop">
        <a class="orderBtn" href="${ORDER_URL}" target="_blank" rel="noopener">Order Pickup</a>
        <div class="menuNote">(Mock) In-store pickup only</div>
      </div>

      <div class="menuTop" role="tablist" aria-label="Menu sections">
        ${tabs}
      </div>

      ${sections}
    `;
  }

  function openModal(key) {
    const card = CARDS[key];
    if (!card) return;

    modalTitle.textContent = card.title;
    modalBody.innerHTML = card.html;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    // Wire menu tabs each time menu modal opens
    if (key === "menu") wireMenuTabs();
  }

  function closeModal() {
    modal.hidden = true;
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  function wireMenuTabs() {
    const tabs = $$(".menuTab", modalBody);
    const sections = $$(".menuSection[data-section]", modalBody);

    const show = (id) => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === id)));
      sections.forEach((sec) => {
        sec.style.display = sec.dataset.section === id ? "" : "none";
      });
      modalBody.scrollTop = 0;
    };

    tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));
  }

  // Click handlers for any [data-open]
  function bindOpeners() {
    $$("[data-open]").forEach((el) => {
      el.addEventListener("click", () => openModal(el.dataset.open));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(el.dataset.open);
        }
      });
    });
  }

  // Close handlers
  function bindClosers() {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (!modal.hidden && e.key === "Escape") closeModal();
    });
  }

  // Boot
  bindOpeners();
  bindClosers();

  // Service worker (offline)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();