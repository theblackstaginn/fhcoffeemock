(() => {
  "use strict";

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

  const modal=$("#modal");
  const modalTitle=$("#modalTitle");
  const modalBody=$("#modalBody");

  const MENU=[ /* unchanged menu data */ ];

  const CARDS={
    hours:{
      title:"Hours",
      html:`<img src="hours-panel.PNG" style="width:100%;border-radius:18px;">`
    },
    counter:{
      title:"Inside",
      html:`<img src="counter.jpg" style="width:100%;border-radius:18px;">`
    },
    feature:{
      title:"Rise & Shine",
      html:`<img src="r-s-coffee.jpg" style="width:100%;border-radius:18px;">`
    },
    menu:{
      title:"Menu",
      html:buildMenu()
    }
  };

  function buildMenu(){
    const tabs=MENU.map((s,i)=>
      `<button class="menuTab" data-tab="${s.id}" aria-selected="${i===0}">${s.id}</button>`
    ).join("");

    const sections=MENU.map((s,i)=>`
      <div class="menuSection" data-section="${s.id}" ${i?`style="display:none"`:""}>
        <h3>${s.id}</h3>
        ${s.items.map(it=>`
          <div class="menuItem">
            <div class="name">${it.name}</div>
            ${it.note?`<div class="note">${it.note}</div>`:""}
          </div>`).join("")}
      </div>`).join("");

    return `
      <div class="menuTop">${tabs}</div>
      ${sections}
      <button class="orderBtn">Order Pickup</button>
    `;
  }

  function openModal(k){
    modalTitle.textContent=CARDS[k].title;
    modalBody.innerHTML=CARDS[k].html;
    modal.hidden=false;
    document.body.style.overflow="hidden";
    if(k==="menu") wireTabs();
  }
  function closeModal(){
    modal.hidden=true;
    modalBody.innerHTML="";
    document.body.style.overflow="";
  }

  function wireTabs(){
    const tabs=$$(".menuTab",modalBody);
    const secs=$$(".menuSection",modalBody);
    tabs.forEach(t=>t.onclick=()=>{
      tabs.forEach(x=>x.setAttribute("aria-selected",x===t));
      secs.forEach(s=>s.style.display=s.dataset.section===t.dataset.tab?"":"none");
      modalBody.scrollTop=0;
    });
  }

  $$("[data-open]").forEach(b=>b.onclick=()=>openModal(b.dataset.open));
  modal.addEventListener("click",e=>{
    if(e.target.dataset.close) closeModal();
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!modal.hidden) closeModal();
  });
})();