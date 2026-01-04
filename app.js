/* app.js — Farmhouse Mock
   - Mobile-safe modal (Menu / Hours)
   - Coffee menu ONLY (removes breakfast/lunch)
   - Works with pointer events (iOS/Android/desktop)
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

    // Focus close button for accessibility
    const closeBtn = $(".modal__close", modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
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
    // Uses your hours-panel.PNG
    return `
      <img class="hoursImg" src="./hours-panel.PNG" alt="Hours" loading="lazy">
    `;
  }

  // Close handlers
  function initModal() {
    if (!modal) return;

    // Close via buttons/backdrop
    $$("[data-close]", modal).forEach(el => {
      el.addEventListener("pointerup", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    // Close via ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });

    // Prevent clicks inside sheet from closing
    const sheet = $(".modal__sheet", modal);
    if (sheet) {
      sheet.addEventListener("pointerup", (e) => e.stopPropagation());
    }

    // If user taps backdrop (not sheet)
    modal.addEventListener("pointerup", (e) => {
      const backdrop = $(".modal__backdrop", modal);
      if (backdrop && e.target === backdrop) closeModal();
    });
  }

  /* ===========================
     Buttons + tiles
     =========================== */
  function initActions() {
    // Menu / Hours buttons in hero
    $$("[data-open]").forEach(el => {
      el.addEventListener("pointerup", (e) => {
        e.preventDefault();
        const which = el.getAttribute("data-open");
        if (which === "menu") openModal("Menu", renderMenuHtml());
        if (which === "hours") openModal("Hours", renderHoursHtml());
      });
    });

    // Tile that opens menu
    $$("[data-tile='menu']").forEach(el => {
      el.addEventListener("pointerup", (e) => {
        e.preventDefault();
        openModal("Menu", renderMenuHtml());
      });
    });
  }

  /* ===========================
     Carousels (swipe + dots + tap-to-advance)
     =========================== */
  function initCarousel(root) {
    const viewport = $(".carousel__viewport", root);
    const track = $(".carousel__track", root);
    const imgs = $$(".carousel__img", root);
    const dots = $(".dots", root);
    if (!viewport || !track || imgs.length === 0 || !dots) return;

    // Build dots
    dots.innerHTML = "";
    const dotEls = imgs.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot";
      d.setAttribute("aria-label", `Slide ${i + 1}`);
      d.addEventListener("pointerup", (e) => {
        e.preventDefault();
        viewport.scrollTo({ left: viewport.clientWidth * i, behavior: "smooth" });
      });
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

    // Tap-to-advance that doesn't trigger on swipes
    let downX = 0;
    let downY = 0;
    let downT = 0;
    let moved = false;

    viewport.addEventListener("pointerdown", (e) => {
      // Only primary pointer
      if (e.pointerType === "mouse" && e.button !== 0) return;
      downX = e.clientX;
      downY = e.clientY;
      downT = performance.now();
      moved = false;
    });

    viewport.addEventListener("pointermove", (e) => {
      const dx = Math.abs(e.clientX - downX);
      const dy = Math.abs(e.clientY - downY);
      if (dx > 10 || dy > 10) moved = true;
    });

    viewport.addEventListener("pointerup", (e) => {
      // Ignore if user interacted with dots
      if (e.target && (e.target.classList?.contains("dot") || e.target.closest?.(".dots"))) return;

      const dt = performance.now() - downT;
      const dx = Math.abs(e.clientX - downX);
      const dy = Math.abs(e.clientY - downY);

      // Treat as tap only if quick + low movement
      const isTap = !moved && dt < 450 && dx < 12 && dy < 12;
      if (!isTap) return;

      const r = viewport.getBoundingClientRect();
      const x = e.clientX - r.left;
      const idx = getIndex();
      if (x < r.width * 0.5) go(idx - 1);
      else go(idx + 1);
    });
  }

  function initCarousels() {
    $$(".carousel").forEach(initCarousel);
  }

  /* ===========================
     Extra: inject minimal menu styling inside modal
     =========================== */
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