// Configuração: informe apenas o DDI + DDD + número, sem espaços ou símbolos.
const CONFIG = {
  whatsappNumber: "+5562996997608",
  dateText: "amanhã",
  startCity: "Joinville",
  romanticMessage: true
};

const SCENE_ORDER = ["dream", "night", "car", "arrival", "getting-ready", "waiting", "hello", "outing", "adventure", "dinner", "goodbye", "reveal", "question"];
const TRANSITION_MS = 850;
const sceneTimers = new Set();
let noAttempts = 0;
let noAnimationFrame = 0;
let noButtonPosition = null;
let noButtonVelocity = { x: 245, y: 190 };
let noPreviousFrame = 0;

// Navegação entre cenas
function showScene(sceneId) {
  const nextScene = document.querySelector(`[data-scene="${sceneId}"]`);
  if (!nextScene) return;

  sceneTimers.forEach(window.clearTimeout);
  sceneTimers.clear();

  const currentScene = document.querySelector(".scene.is-active");
  if (currentScene && currentScene !== nextScene) {
    currentScene.classList.remove("is-active");
    currentScene.classList.add("is-leaving");
    window.setTimeout(() => {
      currentScene.classList.remove("is-leaving");
      currentScene.hidden = true;
    }, TRANSITION_MS);
  }

  nextScene.hidden = false;
  nextScene.classList.remove("is-leaving");
  nextScene.querySelectorAll("[data-enter]").forEach((element) => element.classList.remove("is-shown"));
  requestAnimationFrame(() => nextScene.classList.add("is-active"));

  nextScene.querySelectorAll("[data-enter]").forEach((element) => {
    const delay = Number(element.dataset.delay || 0);
    const timer = window.setTimeout(() => element.classList.add("is-shown"), delay);
    sceneTimers.add(timer);
  });

  updateProgress(sceneId);
  const heading = nextScene.querySelector("h1, h2");
  if (heading) window.setTimeout(() => heading.focus({ preventScroll: true }), 100);
  if (sceneId === "question") resetNoButton();
  if (sceneId === "car") restartCarAnimation();
  if (sceneId === "car") {
    const dust = document.querySelector(".road-scene__dust");
    dust.classList.remove("is-active");
    const dustTimer = window.setTimeout(() => dust.classList.add("is-active"), 4150);
    sceneTimers.add(dustTimer);
  }
  if (sceneId === "waiting") {
    const timer = window.setTimeout(() => showScene("hello"), 4300);
    sceneTimers.add(timer);
  }
  if (sceneId === "goodbye") restartGoodbyeAnimation();
}

function updateProgress(sceneId) {
  const progressScene = sceneId === "answer" ? "question" : sceneId;
  const index = SCENE_ORDER.indexOf(progressScene);
  const progress = document.querySelector(".progress");
  const fill = document.querySelector(".progress__fill");
  const step = Math.max(1, index + 1);
  progress.setAttribute("aria-valuenow", String(step));
  fill.style.width = `${(step / SCENE_ORDER.length) * 100}%`;
}

function restartCarAnimation() {
  const car = document.querySelector(".car-illustration");
  car.style.animation = "none";
  void car.offsetWidth;
  car.style.animation = "";
}

function restartGoodbyeAnimation() {
  document.querySelectorAll(".walker").forEach((walker) => {
    walker.style.animation = "none";
    void walker.offsetWidth;
    walker.style.animation = "";
  });
}

// Respostas e links do WhatsApp
function getWhatsAppUrl(answer) {
  const messages = CONFIG.romanticMessage
    ? {
        yes: "Sim! Eu aceito o convite ❤️ Até amanhã!",
        no: "Obrigada pelo convite, mas dessa vez vou passar. ❤️"
      }
    : {
        yes: "Sim! Eu aceito o convite. Até amanhã!",
        no: "Obrigada pelo convite, mas dessa vez vou passar."
      };
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  const recipient = number ? `/${number}` : "/";
  return `https://wa.me${recipient}?text=${encodeURIComponent(messages[answer])}`;
}

function showAnswer(answer) {
  stopNoButtonRoaming();
  const scene = document.querySelector("#answer");
  const heading = document.querySelector("#answer-title");
  const copy = document.querySelector("#answer-copy");
  const eyebrow = document.querySelector("#answer-eyebrow");
  const link = document.querySelector("#whatsapp-link");

  scene.classList.toggle("is-declined", answer === "no");
  if (answer === "no") {
    eyebrow.textContent = "obrigado por me contar";
    heading.textContent = "Tudo bem ❤️";
    copy.textContent = "Obrigado por ser sincera. Prometo não transformar um não em negociação 😂";
  } else {
    eyebrow.textContent = "combinado";
    heading.textContent = "❤️ Então está combinado.";
    copy.textContent = "Eu cuido do resto. Até amanhã.";
    launchConfetti();
  }

  link.innerHTML = answer === "yes"
    ? 'Até logo <span aria-hidden="true">↗</span>'
    : 'Enviar resposta pelo WhatsApp <span aria-hidden="true">↗</span>';
  link.href = getWhatsAppUrl(answer);
  showScene("answer");
}

function handleNoClick() {
  const hint = document.querySelector("#no-hint");
  const button = document.querySelector("#no-button");
  noAttempts += 1;

  if (noAttempts >= 7) {
    hint.textContent = "Tudo bem, já entendi que você não quer ❤️";
    showAnswer("no");
    return;
  }

  const messages = [
    "Tem certeza? 😂",
    "O botão percebeu sua intenção e começou a fugir.",
    "Mais uma vida do gato foi embora.",
    "Você está mesmo determinada, hein?",
    "Ele está quicando pelas paredes agora.",
    "Última vida. Prometo que agora ele para."
  ];
  hint.textContent = `${messages[noAttempts - 1]}  Vida ${noAttempts} de 7.`;

  if (noAttempts === 1) {
    const move = Math.random() < .5 ? -76 : 76;
    button.style.transform = `translate(${move}px, ${Math.random() < .5 ? -36 : 36}px)`;
  } else if (noAttempts >= 2) {
    startNoButtonRoaming(button);
  }
}

function resetNoButton() {
  stopNoButtonRoaming();
  noAttempts = 0;
  noButtonVelocity = { x: 245, y: 190 };
  document.querySelector("#no-hint").replaceChildren();
}

function startNoButtonRoaming(button) {
  if (noAnimationFrame) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = button.getBoundingClientRect();
  noButtonPosition = { x: bounds.left, y: bounds.top };
  button.style.transform = "none";
  button.classList.add("is-roaming");
  button.style.left = `${noButtonPosition.x}px`;
  button.style.top = `${noButtonPosition.y}px`;
  noPreviousFrame = 0;

  const bounce = (timestamp) => {
    if (!noButtonPosition || !button.isConnected) return;
    const elapsed = noPreviousFrame ? Math.min((timestamp - noPreviousFrame) / 1000, .04) : 0;
    noPreviousFrame = timestamp;
    const maxX = Math.max(8, window.innerWidth - button.offsetWidth - 8);
    const maxY = Math.max(8, window.innerHeight - button.offsetHeight - 8);
    noButtonPosition.x += noButtonVelocity.x * elapsed;
    noButtonPosition.y += noButtonVelocity.y * elapsed;

    if (noButtonPosition.x <= 8 || noButtonPosition.x >= maxX) noButtonVelocity.x *= -1;
    if (noButtonPosition.y <= 8 || noButtonPosition.y >= maxY) noButtonVelocity.y *= -1;
    noButtonPosition.x = Math.max(8, Math.min(noButtonPosition.x, maxX));
    noButtonPosition.y = Math.max(8, Math.min(noButtonPosition.y, maxY));
    button.style.left = `${noButtonPosition.x}px`;
    button.style.top = `${noButtonPosition.y}px`;
    noAnimationFrame = window.requestAnimationFrame(bounce);
  };
  noAnimationFrame = window.requestAnimationFrame(bounce);
}

function pauseNoButtonRoaming() {
  if (noAnimationFrame) window.cancelAnimationFrame(noAnimationFrame);
  noAnimationFrame = 0;
}

function stopNoButtonRoaming() {
  if (noAnimationFrame) window.cancelAnimationFrame(noAnimationFrame);
  noAnimationFrame = 0;
  noButtonPosition = null;
  const button = document.querySelector("#no-button");
  if (button) {
    button.classList.remove("is-roaming");
    button.style.removeProperty("left");
    button.style.removeProperty("top");
    button.style.removeProperty("transform");
  }
}

// Efeitos visuais leves
function createStars() {
  const container = document.querySelector("#stars");
  for (let index = 0; index < 44; index += 1) {
    const star = document.createElement("i");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${3 + Math.random() * 5}s`);
    star.style.setProperty("--delay", `${Math.random() * -7}s`);
    container.append(star);
  }
}

function launchConfetti() {
  const container = document.querySelector("#celebration");
  container.replaceChildren();
  const colors = ["#c9a86a", "#8f3040", "#f5f0e6", "#758c71"];
  const bursts = [{ x: 17, y: 34 }, { x: 50, y: 25 }, { x: 83, y: 38 }];
  bursts.forEach((origin, burstIndex) => {
    const core = document.createElement("i");
    core.className = "firework-core";
    core.style.setProperty("--origin-x", `${origin.x}%`);
    core.style.setProperty("--origin-y", `${origin.y}%`);
    container.append(core);

    for (let index = 0; index < 24; index += 1) {
      const particle = document.createElement("i");
      const angle = (Math.PI * 2 * index) / 24;
      const distance = 42 + Math.random() * 76;
      particle.className = "firework";
      particle.style.setProperty("--origin-x", `${origin.x}%`);
      particle.style.setProperty("--origin-y", `${origin.y}%`);
      particle.style.setProperty("--fire-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--fire-y", `${Math.sin(angle) * distance}px`);
      particle.style.setProperty("--fire-color", colors[(index + burstIndex) % colors.length]);
      particle.style.animationDelay = `${burstIndex * .32 + Math.random() * .14}s`;
      container.append(particle);
    }
  });
}

// Inicialização e eventos
function initializeInvitation() {
  document.querySelectorAll("[data-start-city]").forEach((element) => {
    element.textContent = CONFIG.startCity;
  });
  document.querySelectorAll("[data-date]").forEach((element) => {
    element.textContent = CONFIG.dateText;
  });
  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => showScene(button.dataset.next));
  });
  document.querySelector("#yes-button").addEventListener("click", () => showAnswer("yes"));
  const noButton = document.querySelector("#no-button");
  noButton.addEventListener("pointerdown", pauseNoButtonRoaming);
  noButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") pauseNoButtonRoaming();
  });
  noButton.addEventListener("click", handleNoClick);
  createStars();
  showScene("dream");
}

document.addEventListener("DOMContentLoaded", initializeInvitation);