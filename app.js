(() => {
  "use strict";

  const modal = document.querySelector(".modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // ---- MENU DATA (placeholder) ----
  const MENU = [
    {
      tab: "Coffee",
      sections: [
        {
          title: "House Coffee",
          items: [
            { name: "Drip Coffee", price: "$", note: "" },
            { name: "Cold Brew", price: "$", note: "" }
          ]
        },
        {
          title: "Espresso",
          items: [
            { name: "Americano", price: "$", note: "" },
            { name: "Latte", price: "$", note: "" },
            { name: "Cappuccino", price: "$", note: "" }
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
            { name: "Biscuits & Gravy", price: "$", note: "" }
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
            { name: "Salad", price: "$", note: "" }
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
    const img = document.createElement("img");
    img.className = "hoursImg";
    img.src = "./hours-panel.PNG";
    img.alt = "Hours";
    img.loading = "lazy";
    wrap.appendChild(img);
    return wrap;
  }

  // ---- Carousel dots + swipe indexing ----
  function initCarousel(carousel) {
    const track = carousel.querySelector(".carousel__track");
    const slides = [...carousel.querySelectorAll(".carousel__slide")];
    const dotsWrap = carousel.querySelector(".carousel__dots");
    if (!track || slides.length === 0 || !dotsWrap) return;

    dotsWrap.innerHTML = "";

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        const w = track.clientWidth;
        track.scrollTo({ left: i * w, behavior: "smooth" });
      });
      dotsWrap.appendChild(b);
      return b;
    });

    function setActive(idx) {
      dots.forEach((d, i) => d.setAttribute("aria-current", i === idx ? "true" : "false"));
    }

    let raf = 0;
    track.addEventListener("scroll", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.clientWidth || 1;
        const idx = Math.round(track.scrollLeft / w);
        setActive(Math.max(0, Math.min(idx, slides.length - 1)));
      });
    });

    // Ensure correct on resize
    window.addEventListener("resize", () => {
      const w = track.clientWidth || 1;
      const idx = Math.round(track.scrollLeft / w);
      setActive(Math.max(0, Math.min(idx, slides.length - 1)));
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);

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
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });
})();