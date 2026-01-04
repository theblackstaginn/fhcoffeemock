(() => {
  "use strict";

  const modal = document.querySelector(".modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  if (!modal || !modalTitle || !modalBody) {
    console.warn("[Farmhouse] Modal elements not found. Check .modal/#modalTitle/#modalBody.");
    return;
  }

  // ===========================
  // MENU DATA (COFFEE ONLY)
  // ===========================
  const MENU = [
    {
      tab: "Coffee",
      sections: [
        {
          title: "House Coffee",
          items: [
            { name: "Drip Coffee", price: "", note: "" },
            { name: "Cold Brew", price: "", note: "" },
          ]
        },
        {
          title: "Espresso",
          items: [
            { name: "Americano", price: "", note: "" },
            { name: "Latte", price: "", note: "" },
            { name: "Cappuccino", price: "", note: "" },
          ]
        }
      ]
    }
  ];

  // ===========================
  // MODAL OPEN/CLOSE
  // ===========================
  function openModal(title, contentNode) {
    modalTitle.textContent = title;
    modalBody.innerHTML = "";
    modalBody.appendChild(contentNode);

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ===========================
  // MENU UI
  // ===========================
  function buildMenuUI() {
    const wrap = document.createElement("div");

    // Guard: if menu is empty, show a simple message
    if (!Array.isArray(MENU) || MENU.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Menu coming soon.";
      wrap.appendChild(p);
      return wrap;
    }

    const content = document.createElement("div");
    content.className = "menuContent";

    let activeIndex = 0;

    function renderTab(i) {
      activeIndex = i;
      content.innerHTML = "";

      const data = MENU[i];

      (data.sections || []).forEach(sec => {
        const section = document.createElement("section");
        section.className = "menuSection";

        const h = document.createElement("h3");
        h.textContent = sec.title || "";
        section.appendChild(h);

        (sec.items || []).forEach(it => {
          const row = document.createElement("div");
          row.className = "menuItem";

          const left = document.createElement("div");

          const name = document.createElement("div");
          name.className = "name";
          name.textContent = it.name || "";
          left.appendChild(name);

          if (it.note) {
            const note = document.createElement("div");
            note.className = "note";
            note.textContent = it.note;
            left.appendChild(note);
          }

          const priceText = (it.price || "").trim();
          const price = document.createElement("div");
          price.className = "price";
          price.textContent = priceText; // stays blank if blank

          row.appendChild(left);

          // Only append price node if there is a price
          if (priceText) row.appendChild(price);

          section.appendChild(row);
        });

        content.appendChild(section);
      });

      // Update aria-selected if tabs exist
      const tabBar = wrap.querySelector(".menuTop");
      if (tabBar) {
        [...tabBar.children].forEach((btn, idx) => {
          btn.setAttribute("aria-selected", idx === activeIndex ? "true" : "false");
        });
      }
    }

    // Only render tabs if there is more than one tab
    if (MENU.length > 1) {
      const tabs = document.createElement("div");
      tabs.className = "menuTop";
      wrap.appendChild(tabs);

      MENU.forEach((m, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "menuTab";
        b.textContent = m.tab || `Tab ${idx + 1}`;
        b.setAttribute("aria-selected", idx === 0 ? "true" : "false");
        b.addEventListener("click", () => renderTab(idx));
        tabs.appendChild(b);
      });
    }

    wrap.appendChild(content);
    renderTab(0);
    return wrap;
  }

  function buildHoursUI() {
    const wrap = document.createElement("div");
    const img = document.createElement("img");
    img.className = "hoursImg";
    img.src = "./hours-panel.PNG";
    img.alt = "Hours";
    img.loading = "lazy";
    wrap.appendChild(img);
    return wrap;
  }

  // ===========================
  // EVENT WIRING
  // ===========================
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open]");
    if (openBtn) {
      const what = openBtn.getAttribute("data-open");
      if (what === "menu") openModal("Menu", buildMenuUI());
      if (what === "hours") openModal("Hours", buildHoursUI());
      return;
    }

    const tile = e.target.closest("[data-tile]");
    if (tile) {
      const what = tile.getAttribute("data-tile");
      if (what === "menu") openModal("Menu", buildMenuUI());
      if (what === "hours") openModal("Hours", buildHoursUI());
      return;
    }

    if (e.target.matches("[data-close]") || e.target.closest("[data-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();