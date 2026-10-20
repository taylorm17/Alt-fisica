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
  inscrições: initInscrições,
  quiz: initQuiz
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
  const indicators = document.querySelector(".post-indicators");
  let index = 0;
  const dots = Array.from(slides, (_, slideIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "post-indicator";
    dot.setAttribute("aria-label", `Ir para o post ${slideIndex + 1}`);
    dot.setAttribute("aria-pressed", "false");
    dot.addEventListener("click", () => showSlide(slideIndex));
    indicators?.appendChild(dot);
    return dot;
  });

  function showSlide(i){

    if(i < 0) index = slides.length - 1;
    else if(i >= slides.length) index = 0;
    else index = i;

    container.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

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

  const faq = document.querySelector("#faq");
  const toggle = faq?.querySelector(".faq-toggle");

  if (!faq || !toggle) return;

  toggle.addEventListener("click", () => {
    const expanded = faq.classList.toggle("faq-expanded");

    toggle.textContent = expanded ? "menos" : "mais";
    toggle.setAttribute("aria-expanded", String(expanded));

    if (!expanded) {
      faq.querySelectorAll(".faq-extra.accordion-content").forEach(content => {
        content.style.maxHeight = null;
      });
    }
  });
}
/* =========================
   inscrições
========================= */
function initInscrições(){
}

/* =========================
   QUIZ
========================= */

function initQuiz(){
  const startForm = document.getElementById("quiz-start-form");
  const usernameInput = document.getElementById("quiz-username");
  const startStatus = document.getElementById("quiz-start-status");
  const game = document.getElementById("quiz-game");
  const result = document.getElementById("quiz-result");
  const playerLabel = document.getElementById("quiz-player");
  const countLabel = document.getElementById("quiz-count");
  const progress = document.getElementById("quiz-progress");
  const progressFill = document.getElementById("quiz-progress-fill");
  const timerLabel = document.getElementById("quiz-timer");
  const timerProgress = document.getElementById("quiz-timer-progress");
  const timerFill = document.getElementById("quiz-timer-fill");
  const questionLabel = document.getElementById("quiz-question");
  const optionsContainer = document.getElementById("quiz-options");
  const feedback = document.getElementById("quiz-feedback");
  const nextButton = document.getElementById("quiz-next");
  const againButton = document.getElementById("quiz-again");

  if (
    !startForm || !(usernameInput instanceof HTMLInputElement) || !startStatus ||
    !game || !result || !playerLabel || !countLabel || !progress ||
    !progressFill || !timerLabel || !timerProgress || !timerFill ||
    !questionLabel || !optionsContainer || !feedback || !nextButton || !againButton
  ) return;

  const questions = [
    {
      question: "Qual partícula elementar está associada ao campo que ajuda a explicar a origem da massa de outras partículas?",
      options: ["Fóton", "Bóson de Higgs", "Glúon", "Neutrino"],
      answer: 1
    },
    {
      question: "Quais partículas formam um próton?",
      options: ["Dois quarks up e um quark down", "Dois quarks down e um quark up", "Um elétron e dois neutrinos", "Três quarks strange"],
      answer: 0
    },
    {
      question: "Qual é a carga elétrica do elétron?",
      options: ["Positiva", "Neutra", "Negativa", "Depende da velocidade"],
      answer: 2
    },
    {
      question: "Qual partícula transmite a interação eletromagnética?",
      options: ["Glúon", "Fóton", "Bóson W", "Bóson de Higgs"],
      answer: 1
    },
    {
      question: "Qual interação mantém os quarks unidos dentro de prótons e nêutrons?",
      options: ["Gravitacional", "Eletromagnética", "Nuclear forte", "Nuclear fraca"],
      answer: 2
    },
    {
      question: "O que significa a sigla LHC?",
      options: ["Laboratório de Hadrons e Colisões", "Large Hadron Collider", "Large Helium Chamber", "Laboratório de Higgs e Campos"],
      answer: 1
    },
    {
      question: "Qual destas partículas não possui carga elétrica?",
      options: ["Elétron", "Próton", "Quark up", "Neutrino"],
      answer: 3
    },
    {
      question: "O que é a antimatéria?",
      options: ["Matéria sem massa", "Matéria feita de antipartículas correspondentes", "Um tipo de matéria escura", "Matéria que só existe no espaço"],
      answer: 1
    },
    {
      question: "Qual partícula é um bóson mediador da interação nuclear forte?",
      options: ["Glúon", "Elétron", "Quark top", "Neutrino"],
      answer: 0
    },
    {
      question: "Prótons e nêutrons pertencem a qual grupo de partículas?",
      options: ["Léptons", "Bósons", "Hádrons", "Antipartículas"],
      answer: 2
    },
    {
      question: "Qual é o papel dos detectores em experimentos de colisão de partículas?",
      options: ["Acelerar os feixes de partículas", "Registrar sinais produzidos pelas partículas", "Criar novos elementos químicos", "Impedir as colisões"],
      answer: 1
    },
    {
      question: "Qual partícula é um lépton?",
      options: ["Próton", "Glúon", "Elétron", "Méson"],
      answer: 2
    },
    {
      question: "O que pode acontecer quando uma partícula encontra sua antipartícula?",
      options: ["Elas se transformam em quarks", "Podem se aniquilar, produzindo outras partículas", "A carga de ambas desaparece sem liberar energia", "Elas formam sempre um nêutron"],
      answer: 1
    }
  ];
  const questionDuration = 60;
  let username = "";
  let questionIndex = 0;
  let correctAnswers = 0;
  let elapsedMilliseconds = 0;
  let questionStartedAt = 0;
  let deadline = 0;
  let timerInterval = 0;
  let advanceTimeout = 0;
  let answered = false;

  function formatTime(seconds){
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  function stopTimers(){
    window.clearInterval(timerInterval);
    window.clearTimeout(advanceTimeout);
  }

  function updateTimer(){
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    timerLabel.textContent = formatTime(remaining);
    timerProgress.setAttribute("aria-valuenow", String(remaining));
    timerFill.style.width = `${(remaining / questionDuration) * 100}%`;
    timerFill.classList.toggle("is-low", remaining <= 10);

    if (remaining === 0) {
      finishAnswer(null, true);
    }
  }

  function renderQuestion(){
    stopTimers();
    answered = false;
    const currentQuestion = questions[questionIndex];
    const completedQuestions = questionIndex;

    playerLabel.textContent = `Jogador: ${username}`;
    countLabel.textContent = `Pergunta ${questionIndex + 1} de ${questions.length}`;
    progress.setAttribute("aria-valuemax", String(questions.length));
    progress.setAttribute("aria-valuenow", String(completedQuestions));
    progressFill.style.width = `${(completedQuestions / questions.length) * 100}%`;
    questionLabel.textContent = currentQuestion.question;
    optionsContainer.replaceChildren();
    feedback.textContent = "";
    nextButton.hidden = true;
    nextButton.textContent = questionIndex === questions.length - 1
      ? "Ver resultado →"
      : "Próxima pergunta →";

    currentQuestion.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => finishAnswer(optionIndex, false));
      optionsContainer.appendChild(button);
    });

    questionStartedAt = Date.now();
    deadline = questionStartedAt + questionDuration * 1000;
    updateTimer();
    timerInterval = window.setInterval(updateTimer, 250);
    questionLabel.focus();
  }

  function finishAnswer(selectedIndex, timedOut){
    if (answered) return;

    timedOut = timedOut || Date.now() >= deadline;
    if (timedOut) selectedIndex = null;
    answered = true;
    window.clearInterval(timerInterval);
    const questionElapsed = Date.now() - questionStartedAt;
    elapsedMilliseconds += timedOut
      ? questionDuration * 1000
      : Math.min(questionDuration * 1000, questionElapsed);

    const currentQuestion = questions[questionIndex];
    const optionButtons = optionsContainer.querySelectorAll(".quiz-option");
    optionButtons.forEach((button, index) => {
      button.disabled = true;
      if (index === currentQuestion.answer) button.classList.add("is-correct");
      if (index === selectedIndex && index !== currentQuestion.answer) {
        button.classList.add("is-incorrect");
      }
    });

    if (selectedIndex === currentQuestion.answer) {
      correctAnswers += 1;
      feedback.textContent = "Resposta certa! +100 pontos";
    } else if (timedOut) {
      feedback.textContent = `O tempo acabou. A resposta era: ${currentQuestion.options[currentQuestion.answer]}.`;
    } else {
      feedback.textContent = `Quase! A resposta certa era: ${currentQuestion.options[currentQuestion.answer]}.`;
    }

    if (timedOut) {
      advanceTimeout = window.setTimeout(advanceQuestion, 1800);
    } else {
      nextButton.hidden = false;
      nextButton.focus();
    }
  }

  function advanceQuestion(){
    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
      return;
    }

    finishQuiz();
  }

  function finishQuiz(){
    stopTimers();
    game.hidden = true;
    result.hidden = false;
    progress.setAttribute("aria-valuenow", String(questions.length));
    progressFill.style.width = "100%";

    const score = correctAnswers * 100;
    const elapsedSeconds = Math.round(elapsedMilliseconds / 1000);
    document.getElementById("quiz-result-title").textContent = `Mandou bem, ${username}!`;
    document.getElementById("quiz-score").textContent = String(score);
    document.getElementById("quiz-correct").textContent = `${correctAnswers}/${questions.length}`;
    document.getElementById("quiz-total-time").textContent = formatTime(elapsedSeconds);
    document.getElementById("quiz-username-result").textContent = username;

    window.dispatchEvent(new CustomEvent("quiz:completed", {
      detail: {
        username,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        elapsedSeconds,
        finishedAt: new Date().toISOString()
      }
    }));
  }

  startForm.addEventListener("submit", event => {
    event.preventDefault();
    const selectedUsername = usernameInput.value.trim();

    if (!selectedUsername) {
      startStatus.textContent = "Digite um nome de usuário para começar.";
      usernameInput.focus();
      return;
    }

    stopTimers();
    username = selectedUsername;
    questionIndex = 0;
    correctAnswers = 0;
    elapsedMilliseconds = 0;
    startStatus.textContent = "";
    startForm.hidden = true;
    result.hidden = true;
    game.hidden = false;
    renderQuestion();
  });

  nextButton.addEventListener("click", advanceQuestion);
  againButton.addEventListener("click", () => {
    stopTimers();
    result.hidden = true;
    game.hidden = true;
    startForm.hidden = false;
    usernameInput.focus();
  });
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