(() => {
  "use strict";

  const modal = document.querySelector(".modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // ---- EDIT THIS MENU DATA ----
  const MENU = [
    {
      tab: "Coffee",
      sections: [
        {
          title: "House Coffee",
          items: [
            { name: "Drip Coffee", price: "$", note: "" },
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

  // ---- Modal wiring (Menu button) ----
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open]");
    if (openBtn) {
      const what = openBtn.getAttribute("data-open");
      if (what === "menu") openModal("Menu", buildMenuUI());
      return;
    }

    if (e.target.matches("[data-close]") || e.target.closest("[data-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // ---- Instagram-style swipe dots for carousels ----
  function initCarousels() {
    const carousels = document.querySelectorAll(".carousel");
    carousels.forEach((c) => {
      const track = c.querySelector(".carousel__track");
      const dotsWrap = c.querySelector(".carousel__dots");
      const slides = [...track.querySelectorAll("img")];

      if (!track || !dotsWrap || slides.length === 0) return;

      // build dots
      dotsWrap.innerHTML = "";
      const dots = slides.map((_, i) => {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "dot" + (i === 0 ? " is-active" : "");
        d.setAttribute("aria-label", `Slide ${i + 1}`);
        d.addEventListener("click", () => {
          slides[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        });
        dotsWrap.appendChild(d);
        return d;
      });

      // update active dot on scroll
      let raf = 0;
      const update = () => {
        raf = 0;

        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        let bestIdx = 0;
        let bestDist = Infinity;

        slides.forEach((img, i) => {
          const r = img.getBoundingClientRect();
          const imgCenter = r.left + r.width / 2;
          const dist = Math.abs(centerX - imgCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });

        dots.forEach((d, i) => d.classList.toggle("is-active", i === bestIdx));
      };

      track.addEventListener("scroll", () => {
        if (raf) return;
        raf = requestAnimationFrame(update);
      }, { passive: true });

      // initial
      update();
    });
  }

  initCarousels();
})();