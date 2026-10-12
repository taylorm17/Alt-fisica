import { initBackground } from './background.js';
document.addEventListener("DOMContentLoaded", initSite);
/* =========================
   INICIALIZAÇÃO
========================= */
function initSite() {

  initGlobal();

  const page = document.body.dataset.page;

  const pages = {
  home: initHome,
  materiais: initMateriais,
  resultados: initResultados,
  extras: initExtras,
  inscrições: initInscrições
};

  if (pages[page]) pages[page]();
}

/* =========================
   SCRIPTS GLOBAIS
========================= */

function initGlobal() {
  initMenu();
  initHeader();
  
  const canvas = document.getElementById("canvas-bg");
  if (canvas) {
    initBackground(canvas);
  }
}

/* =========================
   MENU
========================= */

function initMenu() {

  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");

  if (!menuBtn || !menu || !overlay) return;

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
    overlay.classList.toggle("show");
    menuBtn.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    menu.classList.remove("open");
    overlay.classList.remove("show");
    menuBtn.classList.remove("active");
  });

}

/* =========================
   HEADER
========================= */

function initHeader(){

  const header = document.getElementById("header");
  const banner = document.getElementById("banner");

  if(!header || !banner) return;

  function atualizarHeader(){

    const bannerBottom = banner.offsetHeight;

    if(window.scrollY >= bannerBottom){
      header.classList.remove("transparent");
      header.classList.add("solid");
    }else{
      header.classList.remove("solid");
      header.classList.add("transparent");
    }

  }

  window.addEventListener("scroll", atualizarHeader);
  window.addEventListener("load", atualizarHeader);

}

/* =========================
   HOME
========================= */

function initHome(){

  const container = document.querySelector(".post-count");
  if(!container) return;

  const slides = container.querySelectorAll("img");
  let index = 0;

  function showSlide(i){

    if(i < 0) index = slides.length - 1;
    else if(i >= slides.length) index = 0;
    else index = i;

    container.style.transform = `translateX(${-index * 100}%)`;

  }

  document.getElementById("prev")?.addEventListener("click", () => showSlide(index-1));
  document.getElementById("next")?.addEventListener("click", () => showSlide(index+1));

  showSlide(0);

}

/* =========================
   MATERIAIS (CARROSSEL)
========================= */

function initMateriais(){

  const carrossel = document.querySelector(".carrossel");
  const esquerda = document.querySelector(".seta.esquerda");
  const direita = document.querySelector(".seta.direita");
  const container = document.querySelector(".carrossel-container");

  if(!carrossel || !esquerda || !direita || !container) return;

  let posicao = 0;
  const itemBase = carrossel.querySelector(".coluna");

  function getGap(){
    return parseFloat(getComputedStyle(carrossel).gap) || 0;
  }

  function obterVisiveis(){
    if (!itemBase) return 1;
    const larguraItem = itemBase.getBoundingClientRect().width + getGap();
    const larguraDisponivel = container.clientWidth;
    return Math.max(1, Math.floor(larguraDisponivel / larguraItem));
  }

  let visiveis = obterVisiveis();

  function atualizarCarrossel(){
    if (!itemBase) return;

    const larguraItem = itemBase.getBoundingClientRect().width + getGap();
    const deslocamento = posicao * larguraItem;
    carrossel.style.transform = `translateX(-${deslocamento}px)`;
  }

  direita.addEventListener("click", () => {

    const total = carrossel.children.length;
    const maxPosicao = total - visiveis;

    posicao = posicao < maxPosicao ? posicao + 1 : 0;
    atualizarCarrossel();

  });

  esquerda.addEventListener("click", () => {

    const total = carrossel.children.length;
    const maxPosicao = total - visiveis;

    posicao = posicao > 0 ? posicao - 1 : maxPosicao;
    atualizarCarrossel();

  });

  window.addEventListener("resize", () => {

    visiveis = obterVisiveis();
    const total = carrossel.children.length;
    const maxPosicao = Math.max(0, total - visiveis);
    if (posicao > maxPosicao) posicao = maxPosicao;
    atualizarCarrossel();

  });

}

/* =========================
   RESULTADOS
========================= */

function initResultados(){

  initAccordion();
  initGaleria();

}
/* =========================
   extras
========================= */
  function initExtras(){
    initAccordion();
}
/* =========================
   inscrições
========================= */
function initInscrições(){
}
/* =========================
   ACCORDION
========================= */

function initAccordion(){

  const buttons = document.querySelectorAll(".accordion-btn");

  buttons.forEach(btn => {

    btn.addEventListener("click", function(){

      const content = this.nextElementSibling;

      if(content.style.maxHeight){
        content.style.maxHeight = null;
      }else{
        content.style.maxHeight = content.scrollHeight + "px";
      }

    });

  });

}

/* =========================
   GALERIA
========================= */

function initGaleria(){
  const previewBox = document.createElement("div");
  previewBox.className = "preview-box";
  document.body.appendChild(previewBox);

  const modal = document.getElementById("galeria-modal");
  const modalImg = document.getElementById("modal-img");
  const fechar = document.querySelector(".fechar");

  if(!modal || !modalImg || !fechar) return;

  const galerias = {
    organizacao:{
      preview:[
        "../imagens/Galeria2025/Org1.png",
        "../imagens/Galeria2025/Org2.png",
        "../imagens/Galeria2025/Org3.png"
      ],
      modal:[
        "../imagens/Galeria2025/Org1.png",
        "../imagens/Galeria2025/Org2.png",
        "../imagens/Galeria2025/Org3.png",
        "../imagens/Galeria2025/Org4.png",
        "../imagens/Galeria2025/Org5.png",
        "../imagens/Galeria2025/Org6.png",
        "../imagens/Galeria2025/Org7.png"
      ]
    },

    participantes:{
      preview:[
        "../imagens/Galeria2025/Part1.png",
        "../imagens/Galeria2025/Part5.png",
        "../imagens/Galeria2025/Part9.png"
      ],
      modal:[
        "../imagens/Galeria2025/Part1.png",
        "../imagens/Galeria2025/Part2.png",
        "../imagens/Galeria2025/Part3.png",
        "../imagens/Galeria2025/Part4.png",
        "../imagens/Galeria2025/Part5.png",
        "../imagens/Galeria2025/Part6.png",
        "../imagens/Galeria2025/Part7.png",
        "../imagens/Galeria2025/Part8.png",
        "../imagens/Galeria2025/Part9.png"
      ]
    }
  };

  let imagens = [];
  let index = 0;

  document.querySelectorAll(".galeria-item").forEach(item => {

  item.addEventListener("mouseenter", e => {

    const tipo = item.dataset.galeria;
    const imgs = galerias[tipo].preview;

    previewBox.innerHTML = "";

    imgs.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      previewBox.appendChild(img);
    });

    previewBox.style.display = "block";

  });

  item.addEventListener("mousemove", e => {

    previewBox.style.top = (e.pageY + 15) + "px";
    previewBox.style.left = (e.pageX + 15) + "px";

  });

  item.addEventListener("mouseleave", () => {

    previewBox.style.display = "none";

  });

  item.addEventListener("click", () => {

    const tipo = item.dataset.galeria;

    imagens = galerias[tipo].modal;
    index = 0;
 
    modal.style.display = "flex";
    modalImg.src = imagens[index];

  });
});



  document.getElementById("next")?.addEventListener("click", () => {
    index = (index + 1) % imagens.length;
    modalImg.src = imagens[index];
  });

  document.getElementById("prev")?.addEventListener("click", () => {
    index = (index - 1 + imagens.length) % imagens.length;
    modalImg.src = imagens[index];
  });

  fechar.onclick = () => modal.style.display = "none";

  modal.onclick = e => {
    if(e.target === modal) modal.style.display = "none";
  };

}