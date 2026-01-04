(() => {
  "use strict";

  const modal = document.querySelector(".modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // ---- EDIT THIS MENU DATA ----
  // Replace with the real Farmhouse Coffee items when you have them.
  const MENU = [
    {
      tab: "Coffee",
      sections: [
        {
          title: "House Coffee",
          items: [
            { name: "Drip Coffee", price: "$" , note: "" },
            { name: "Cold Brew", price: "$", note: "" },
          ]
        },
        {
          title: "Espresso",
          items: [
            { name: "Americano", price: "$", note: "" },
            { name: "Latte", price: "$", note: "" },
            { name: "Cappuccino", price: "$", note: "" },
          ]
        }
      ]
    },
    {
      tab: "Breakfast",
      sections: [
        {
          title: "Breakfast",
          items: [
            { name: "Breakfast Sandwich", price: "$", note: "" },
            { name: "Biscuits & Gravy", price: "$", note: "" },
          ]
        }
      ]
    },
    {
      tab: "Lunch",
      sections: [
        {
          title: "Lunch",
          items: [
            { name: "Soup + Sandwich", price: "$", note: "" },
            { name: "Salad", price: "$", note: "" },
          ]
        }
      ]
    }
  ];

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

  function buildMenuUI() {
    const wrap = document.createElement("div");

    const tabs = document.createElement("div");
    tabs.className = "menuTop";
    wrap.appendChild(tabs);

    const content = document.createElement("div");
    wrap.appendChild(content);

    let activeIndex = 0;

    function renderTab(i) {
      activeIndex = i;
      content.innerHTML = "";

      const data = MENU[i];
      data.sections.forEach(sec => {
        const section = document.createElement("section");
        section.className = "menuSection";

        const h = document.createElement("h3");
        h.textContent = sec.title;
        section.appendChild(h);

        sec.items.forEach(it => {
          const row = document.createElement("div");
          row.className = "menuItem";

          const left = document.createElement("div");
          const name = document.createElement("div");
          name.className = "name";
          name.textContent = it.name;
          left.appendChild(name);

          if (it.note) {
            const note = document.createElement("div");
            note.className = "note";
            note.textContent = it.note;
            left.appendChild(note);
          }

          const price = document.createElement("div");
          price.className = "price";
          price.textContent = it.price || "";

          row.appendChild(left);
          row.appendChild(price);
          section.appendChild(row);
        });

        content.appendChild(section);
      });

      [...tabs.children].forEach((btn, idx) => {
        btn.setAttribute("aria-selected", idx === activeIndex ? "true" : "false");
      });
    }

    MENU.forEach((m, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "menuTab";
      b.textContent = m.tab;
      b.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      b.addEventListener("click", () => renderTab(idx));
      tabs.appendChild(b);
    });

    renderTab(0);
    return wrap;
  }

  function buildHoursUI() {
    const wrap = document.createElement("div");

    // You can swap this for text hours if you prefer.
    const img = document.createElement("img");
    img.className = "hoursImg";
    img.src = "./hours-panel.PNG";
    img.alt = "Hours";
    img.loading = "lazy";
    wrap.appendChild(img);

    return wrap;
  }

  // ---- Event wiring ----
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