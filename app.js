(() => {
  "use strict";

  const modal = document.querySelector(".modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // Image viewer modal (gallery)
  const imgModal = document.getElementById("imgModal");
  const imgModalImg = document.getElementById("imgModalImg");

  // Gallery mount
  const galleryGrid = document.getElementById("galleryGrid");

  // ---- EDIT THIS MENU DATA ----
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

  /* ===========================
     GALLERY: Put ALL non-background, non-hero photos here
     - These become your tiles
     - No text, just images
     =========================== */
  const GALLERY_IMAGES = [
    // Example — replace with your actual filenames:
    "counter.jpg"
    // "interior1.jpg",
    // "drink1.jpg",
    // "kolache.jpg",
    // "latte-art.jpg",
  ];

  /* Exclusions so you don’t accidentally tile UI assets */
  const EXCLUDE = new Set([
    "coffee-bg.PNG",
    "bg-mobile.PNG",
    "sf-hero.jpg",
    "logo.PNG",
    "favicon.PNG",
    "instagram.PNG",
    "facebook.PNG",
    "tiktok.PNG",
    "hours-panel.PNG",
    "menu.jpg"
  ]);

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

  function openImg(src) {
    imgModalImg.src = src;
    imgModal.hidden = false;
    imgModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeImg() {
    imgModal.hidden = true;
    imgModal.setAttribute("aria-hidden", "true");
    imgModalImg.removeAttribute("src");
    // Only restore scroll if the menu modal is not open
    if (modal.hidden) document.body.style.overflow = "";
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
    const img = document.createElement("img");
    img.className = "hoursImg";
    img.src = "./hours-panel.PNG";
    img.alt = "Hours";
    img.loading = "lazy";
    wrap.appendChild(img);
    return wrap;
  }

  /* ===========================
     Build the image-only tile grid
     =========================== */
  function buildGallery() {
    if (!galleryGrid) return;

    galleryGrid.innerHTML = "";

    // Filter out anything excluded (defensive)
    const images = GALLERY_IMAGES
      .map(s => String(s || "").trim())
      .filter(Boolean)
      .filter(fn => !EXCLUDE.has(fn));

    images.forEach((fn) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile";
      btn.setAttribute("aria-label", "Open image");

      const wrap = document.createElement("div");
      wrap.className = "tile__imgWrap";

      const img = document.createElement("img");
      img.className = "tile__img";
      img.src = `./${fn}`;
      img.alt = "";
      img.loading = "lazy";

      wrap.appendChild(img);
      btn.appendChild(wrap);

      btn.addEventListener("click", () => openImg(img.src));

      galleryGrid.appendChild(btn);
    });
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

    if (e.target.matches("[data-close]") || e.target.closest("[data-close]")) {
      closeModal();
      return;
    }

    if (e.target.matches("[data-img-close]") || e.target.closest("[data-img-close]")) {
      closeImg();
      return;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!imgModal.hidden) closeImg();
      else if (!modal.hidden) closeModal();
    }
  });

  // Boot
  buildGallery();
})();