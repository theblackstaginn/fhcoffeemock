/* app.js — Farmhouse Mock
   - Mobile-safe modal (Menu / Hours)
   - Coffee menu ONLY
   - Works on iOS/Android/desktop (click + touch + pointer)
   - Carousels: swipe + dots + TAP left/right to advance
*/

(() => {
  "use strict";

  /* ===========================
     DATA (Coffee only)
     =========================== */
  const MENU = [
    {
      title: "House Coffee",
      items: [
        { name: "Drip Coffee", price: "" },
        { name: "Cold Brew", price: "" }
      ]
    },
    {
      title: "Espresso",
      items: [
        { name: "Espresso", price: "" },
        { name: "Americano", price: "" },
        { name: "Latte", price: "" },
        { name: "Cappuccino", price: "" }
      ]
    }
  ];

  /* ===========================
     Helpers
     =========================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function closestAttr(el, attr) {
    return el && el.closest ? el.closest(`[${attr}]`) : null;
  }

  /* ===========================
     Modal
     =========================== */
  const modal = $(".modal");
  const modalBody = $("#modalBody");
  const modalTitle = $("#modalTitle");

  let lastFocus = null;

  function openModal(title, html) {
    if (!modal || !modalBody || !modalTitle) return;

    lastFocus = document.activeElement;

    modalTitle.textContent = title;
    modalBody.innerHTML = html;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    // lock background scroll (mobile)
    document.body.style.overflow = "hidden";

    const closeBtn = $(".modal__close", modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function renderMenuHtml() {
    const sections = MENU.map(sec => {
      const items = sec.items.map(it => {
        const price = it.price ? `<span class="mi__price">${escapeHtml(it.price)}</span>` : "";
        return `
          <div class="mi">
            <div class="mi__name">${escapeHtml(it.name)}</div>
            ${price}
          </div>
        `;
      }).join("");

      return `
        <section class="menuSec">
          <h3 class="menuSec__title">${escapeHtml(sec.title)}</h3>
          <div class="menuSec__items">${items}</div>
        </section>
      `;
    }).join("");

    return `<div class="menuWrap">${sections}</div>`;
  }

  function renderHoursHtml() {
    return `<img class="hoursImg" src="./hours-panel.PNG" alt="Hours" loading="lazy">`;
  }

  function injectMenuCss() {
    const css = `
      .menuWrap{ display:grid; gap:14px; }
      .menuSec__title{ margin:0 0 8px; font-size:16px; }
      .menuSec__items{ display:grid; gap:8px; }
      .mi{ display:flex; justify-content:space-between; gap:12px; padding:8px 10px; border-radius:12px; border:1px solid rgba(0,0,0,.06); background: rgba(0,0,0,.02); }
      .mi__name{ font-weight:600; }
      .mi__price{ opacity:.75; font-weight:700; }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function initModal() {
    if (!modal) return;

    // Close via ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    // Click/tap backdrop or close buttons
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t.closest?.("[data-close]")) return closeModal();
      if (t.classList?.contains("modal__backdrop")) return closeModal();
    });

    // iOS: also listen touchend for reliability
    modal.addEventListener("touchend", (e) => {
      const t = e.target;
      if (t.closest?.("[data-close]")) return closeModal();
      if (t.classList?.contains("modal__backdrop")) return closeModal();
    }, { passive: true });
  }

  /* ===========================
     Actions (Menu / Hours / Tiles)
     - Delegated click + touchend
     =========================== */
  function initActions() {
    const handler = (e) => {
      const t = e.target;

      // Menu/Hours buttons (data-open)
      const openBtn = closestAttr(t, "data-open");
      if (openBtn) {
        const which = openBtn.getAttribute("data-open");
        if (which === "menu") openModal("Menu", renderMenuHtml());
        if (which === "hours") openModal("Hours", renderHoursHtml());
        return;
      }

      // Tile opens menu
      const tileMenu = t.closest?.("[data-tile='menu']");
      if (tileMenu) {
        openModal("Menu", renderMenuHtml());
      }
    };

    // Desktop + Android + most iOS cases
    document.addEventListener("click", handler);

    // iOS fallback (some taps don’t dispatch click if it thinks it was a scroll)
    document.addEventListener("touchend", (e) => {
      // If a swipe/scroll happened, iOS will usually not treat it as a tap.
      // But when it *is* a tap, this makes it consistent.
      handler(e);
    }, { passive: true });
  }

  /* ===========================
     Carousels
     =========================== */
  function initCarousel(root) {
    const viewport = $(".carousel__viewport", root);
    const imgs = $$(".carousel__img", root);
    const dots = $(".dots", root);
    if (!viewport || imgs.length === 0 || !dots) return;

    // Build dots
    dots.innerHTML = "";
    const dotEls = imgs.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot";
      d.setAttribute("aria-label", `Slide ${i + 1}`);

      const goDot = () => viewport.scrollTo({ left: viewport.clientWidth * i, behavior: "smooth" });

      d.addEventListener("click", (e) => { e.preventDefault(); goDot(); });
      d.addEventListener("touchend", () => goDot(), { passive: true });

      dots.appendChild(d);
      return d;
    });

    const getIndex = () =>
      clamp(Math.round(viewport.scrollLeft / viewport.clientWidth), 0, imgs.length - 1);

    const go = (idx) => {
      idx = clamp(idx, 0, imgs.length - 1);
      viewport.scrollTo({ left: viewport.clientWidth * idx, behavior: "smooth" });
    };

    const setActive = () => {
      const idx = getIndex();
      dotEls.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };

    viewport.addEventListener("scroll", () => requestAnimationFrame(setActive), { passive: true });
    window.addEventListener("resize", setActive);
    setActive();

    // Tap-to-advance (robust tap detection)
    let startX = 0, startY = 0, startT = 0, moved = false;

    const start = (x, y) => {
      startX = x; startY = y;
      startT = performance.now();
      moved = false;
    };

    const move = (x, y) => {
      const dx = Math.abs(x - startX);
      const dy = Math.abs(y - startY);
      if (dx > 10 || dy > 10) moved = true;
    };

    const end = (clientX, clientY) => {
      const dt = performance.now() - startT;
      const dx = Math.abs(clientX - startX);
      const dy = Math.abs(clientY - startY);

      const isTap = !moved && dt < 450 && dx < 12 && dy < 12;
      if (!isTap) return;

      const r = viewport.getBoundingClientRect();
      const x = clientX - r.left;
      const idx = getIndex();
      if (x < r.width * 0.5) go(idx - 1);
      else go(idx + 1);
    };

    // Pointer path (modern)
    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      start(e.clientX, e.clientY);
    });

    viewport.addEventListener("pointermove", (e) => {
      move(e.clientX, e.clientY);
    }, { passive: true });

    viewport.addEventListener("pointerup", (e) => {
      // ignore dot hits
      if (e.target?.closest?.(".dots")) return;
      end(e.clientX, e.clientY);
    });

    // Touch fallback (older iOS edge cases)
    viewport.addEventListener("touchstart", (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      start(t.clientX, t.clientY);
    }, { passive: true });

    viewport.addEventListener("touchmove", (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      move(t.clientX, t.clientY);
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
      if (e.target?.closest?.(".dots")) return;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      end(t.clientX, t.clientY);
    }, { passive: true });
  }

  function initCarousels() {
    $$(".carousel").forEach(initCarousel);
  }

  /* ===========================
     Boot
     =========================== */
  function boot() {
    injectMenuCss();
    initModal();
    initActions();
    initCarousels();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();