/* =========================================================
   CHAPTER 20 — INTERACTIVE BIRTHDAY STORY
   Edit the CONFIG section below to personalize the website.
   ========================================================= */

const CONFIG = {
  name: "Someone Special",
  message: `Happy Birthday! 🎂

Twenty is more than just a number. It is the beginning of another beautiful chapter — full of new places, new memories, big dreams and tiny moments worth remembering.

I hope you always keep that spark that makes you, YOU.

May you laugh loudly, dream fearlessly and find a little magic in ordinary days.

Here's to Chapter 20. ✨
With lots of happiness and warm wishes ❤️`,

  // Put your own image paths here, for example:
  // "assets/photos/photo1.jpg"
  photos: [
    { src: "", caption: "A memory that deserves its own little star." },
    { src: "", caption: "One moment. A thousand feelings." },
    { src: "", caption: "Some memories never really leave us." },
    { src: "", caption: "A page worth turning back to." },
    { src: "", caption: "The kind of moment you wish you could pause." },
    { src: "", caption: "More memories are waiting to be made." },
    { src: "", caption: "And this story is only getting started." }
  ],

  // Customize these quiz questions.
  quiz: [
    {
      q: "What should every birthday have?",
      answers: ["Cake 🎂", "Good memories ✨", "Laughter 😂", "All of the above"],
      correct: 3
    },
    {
      q: "What does Chapter 20 represent?",
      answers: ["The ending", "A brand-new beginning", "A boring Monday", "Nothing special"],
      correct: 1
    },
    {
      q: "One thing you absolutely deserve today?",
      answers: ["Extra happiness ❤️", "More sleep 😴", "A surprise 🎁", "All of these"],
      correct: 3
    }
  ]
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let currentScene = 0;
let audioStarted = false;

function goToScene(n) {
  const old = $(`#scene-${currentScene}`);
  const next = $(`#scene-${n}`);
  if (!next || n === currentScene) return;
  old.classList.remove("active");
  old.classList.add("exit");
  setTimeout(() => old.classList.remove("exit"), 800);
  next.classList.add("active");
  currentScene = n;

  if (n === 7) startCountdown();
  if (n === 8) startTypewriter();
  if (n === 9) startFireworks();
}

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;
  const music = $("#birthdayMusic");
  if (music) music.play().catch(() => {});
  $("#soundHint").style.opacity = "0";
}
document.addEventListener("pointerdown", startAudio, { once: true });

$$("[data-next]").forEach(btn => btn.addEventListener("click", () => {
  startAudio();
  goToScene(Number(btn.dataset.next));
}));

// ---------- SECRET PORTALS ----------
$$(".portal").forEach(btn => {
  btn.addEventListener("click", () => {
    const choice = btn.dataset.portal;
    $("#portal-result").textContent = choice === "A"
      ? "The moon chose you. ✦ Keep going..."
      : "The dream opened. ∞ Keep going...";
    setTimeout(() => goToScene(2), 1000);
  });
});

// ---------- ORB ----------
let orbCount = 0;
$("#orb").addEventListener("click", () => {
  orbCount++;
  $("#orb-count").textContent = orbCount;
  $("#orb").animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }],
    { duration: 350, easing: "ease-out" }
  );
  if (orbCount >= 7) setTimeout(() => goToScene(3), 500);
});

// ---------- GIFT ----------
let giftCount = 0;
$("#gift").addEventListener("click", () => {
  giftCount++;
  $("#gift-count").textContent = giftCount;
  if (giftCount >= 5) {
    $("#gift").classList.add("open");
    burstConfetti();
    setTimeout(() => goToScene(4), 950);
  }
});

// ---------- MEMORY JOURNEY ----------
let memoryIndex = 0;
function renderMemory() {
  const item = CONFIG.photos[memoryIndex];
  $("#memory-number").textContent = String(memoryIndex + 1).padStart(2, "0");
  $("#memory-caption").textContent = item.caption;
  const photo = $("#memory-photo");

  if (item.src) {
    photo.style.backgroundImage = `url("${item.src}")`;
    photo.style.backgroundSize = "cover";
    photo.style.backgroundPosition = "center";
    photo.innerHTML = "";
  } else {
    photo.style.backgroundImage = "";
    photo.innerHTML = `<div class="photo-placeholder">YOUR PHOTO ${String(memoryIndex + 1).padStart(2,"0")}</div>`;
  }

  $("#memory-dots").innerHTML = CONFIG.photos.map((_, i) =>
    `<span class="dot ${i === memoryIndex ? "active" : ""}"></span>`
  ).join("");
}
function memoryMove(direction) {
  memoryIndex = (memoryIndex + direction + CONFIG.photos.length) % CONFIG.photos.length;
  const card = $("#memory-card");
  card.animate(
    [{ transform: `translateX(${direction > 0 ? 25 : -25}px)`, opacity: .25 },
     { transform: "translateX(0)", opacity: 1 }],
    { duration: 360, easing: "ease-out" }
  );
  renderMemory();
  if (memoryIndex === CONFIG.photos.length - 1) {
    setTimeout(() => goToScene(5), 900);
  }
}
$("#memory-next").addEventListener("click", () => memoryMove(1));
$("#memory-prev").addEventListener("click", () => memoryMove(-1));

let touchStartX = 0;
$("#memory-card").addEventListener("touchstart", e => touchStartX = e.changedTouches[0].clientX, {passive:true});
$("#memory-card").addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) memoryMove(dx < 0 ? 1 : -1);
}, {passive:true});
renderMemory();

// ---------- STARLIGHT CATCH GAME ----------
const game = $("#star-game");
const player = $("#player");
let gameRunning = false, score = 0, timeLeft = 20, stars = [], gameTimer, spawnTimer;

function movePlayer(clientX, clientY) {
  const r = game.getBoundingClientRect();
  const x = Math.max(25, Math.min(r.width - 25, clientX - r.left));
  const y = Math.max(25, Math.min(r.height - 25, clientY - r.top));
  player.style.left = `${x}px`;
  player.style.top = `${y}px`;
}
game.addEventListener("pointermove", e => { if (gameRunning) movePlayer(e.clientX, e.clientY); });
game.addEventListener("pointerdown", e => { if (gameRunning) movePlayer(e.clientX, e.clientY); });

function spawnStar() {
  if (!gameRunning) return;
  const el = document.createElement("div");
  el.className = "falling-star";
  el.style.left = `${Math.random() * 90 + 5}%`;
  el.style.top = `-30px`;
  game.appendChild(el);
  const star = { el, y: -30, speed: 2.2 + Math.random() * 2.4 };
  stars.push(star);
}
function gameLoop() {
  if (!gameRunning) return;
  const pr = player.getBoundingClientRect();
  stars.forEach((s, i) => {
    s.y += s.speed;
    s.el.style.top = `${s.y}px`;
    const sr = s.el.getBoundingClientRect();
    const dx = sr.left + sr.width/2 - (pr.left + pr.width/2);
    const dy = sr.top + sr.height/2 - (pr.top + pr.height/2);
    if (Math.hypot(dx,dy) < 38) {
      s.el.remove(); stars.splice(i,1);
      score++; $("#score").textContent = score;
      burstAt(sr.left + sr.width/2, sr.top + sr.height/2);
      if (score >= 12) endGame(true);
    } else if (s.y > game.clientHeight + 40) {
      s.el.remove(); stars.splice(i,1);
    }
  });
  requestAnimationFrame(gameLoop);
}
function startGame() {
  if (gameRunning) return;
  gameRunning = true; score = 0; timeLeft = 20;
  $("#score").textContent = "0"; $("#time").textContent = "20";
  $("#game-message").style.display = "none";
  $("#start-game").textContent = "Game running…";
  spawnTimer = setInterval(spawnStar, 600);
  gameTimer = setInterval(() => {
    timeLeft--; $("#time").textContent = timeLeft;
    if (timeLeft <= 0) endGame(score >= 12);
  }, 1000);
  requestAnimationFrame(gameLoop);
}
function endGame(won) {
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(spawnTimer); clearInterval(gameTimer);
  $("#game-message").style.display = "grid";
  $("#game-message").textContent = won ? "You caught them all! ✨" : `So close! You caught ${score} stars.`;
  $("#start-game").textContent = won ? "Continue →" : "Try again";
  if (won) {
    burstConfetti();
    setTimeout(() => goToScene(6), 900);
  }
}
$("#start-game").addEventListener("click", () => {
  if (score >= 12) goToScene(6);
  else startGame();
});

// ---------- QUIZ ----------
let quizIndex = 0;
function renderQuiz() {
  const q = CONFIG.quiz[quizIndex];
  $("#quiz-progress").style.width = `${((quizIndex) / CONFIG.quiz.length) * 100}%`;
  $("#quiz-content").innerHTML = `
    <div class="question">${q.q}</div>
    <div class="answers">
      ${q.answers.map((a,i) => `<button class="answer" data-answer="${i}">${a}</button>`).join("")}
    </div>`;
  $$(".answer").forEach(btn => btn.addEventListener("click", () => {
    const selected = Number(btn.dataset.answer);
    if (selected === q.correct) {
      btn.classList.add("correct");
      if (quizIndex < CONFIG.quiz.length - 1) {
        quizIndex++;
        setTimeout(renderQuiz, 550);
      } else {
        $("#quiz-progress").style.width = "100%";
        setTimeout(() => goToScene(7), 750);
      }
    } else {
      btn.classList.add("wrong");
      btn.animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}], {duration:220});
    }
  }));
}
renderQuiz();

// ---------- COUNTDOWN ----------
let countdownStarted = false;
function startCountdown() {
  if (countdownStarted) return;
  countdownStarted = true;
  let n = 3;
  $("#countdown").textContent = n;
  const timer = setInterval(() => {
    n--;
    if (n <= 0) {
      clearInterval(timer);
      $("#countdown").textContent = "✨";
      setTimeout(() => goToScene(8), 850);
    } else {
      $("#countdown").textContent = n;
    }
  }, 1000);
}

// ---------- TYPEWRITER ----------
let typingStarted = false;
function startTypewriter() {
  if (typingStarted) return;
  typingStarted = true;
  const target = $("#typewriter");
  let i = 0;
  const text = CONFIG.message;
  const tick = () => {
    if (i < text.length) {
      target.textContent += text[i++];
      setTimeout(tick, text[i-1] === "\n" ? 250 : 32);
    } else {
      $("#message-next").classList.remove("hidden");
    }
  };
  tick();
}
$("#message-next").addEventListener("click", () => goToScene(9));

// ---------- FIREWORKS: CENTER-SCREEN VISUAL WONDER ----------
const canvas = $("#fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let rockets = [];
let fireworkRunning = false;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchFirework(x = innerWidth/2, y = innerHeight * .42) {
  const targetY = y;
  rockets.push({
    x: innerWidth/2 + (Math.random()-.5)*40,
    y: innerHeight + 20,
    tx: x + (Math.random()-.5)*90,
    ty: targetY + (Math.random()-.5)*90,
    speed: 8 + Math.random()*2.5,
    hue: Math.random()*360
  });
}
function explode(x,y,hue) {
  for (let i=0; i<110; i++) {
    const a = Math.random()*Math.PI*2;
    const speed = Math.random()*6 + 1.5;
    particles.push({
      x,y,
      vx: Math.cos(a)*speed,
      vy: Math.sin(a)*speed,
      life: 1,
      decay: .008 + Math.random()*.012,
      hue: hue + (Math.random()-.5)*35,
      size: Math.random()*2.5+1
    });
  }
}
function fireworkFrame() {
  if (!fireworkRunning) return;
  ctx.fillStyle = "rgba(9,0,20,.18)";
  ctx.fillRect(0,0,innerWidth,innerHeight);

  rockets.forEach((r,i) => {
    const dx=r.tx-r.x, dy=r.ty-r.y, dist=Math.hypot(dx,dy);
    r.x += dx/dist*r.speed; r.y += dy/dist*r.speed;
    ctx.beginPath(); ctx.arc(r.x,r.y,2,0,Math.PI*2);
    ctx.fillStyle=`hsla(${r.hue},100%,75%,1)`; ctx.fill();
    if (dist < 12) { explode(r.x,r.y,r.hue); rockets.splice(i,1); }
  });

  particles.forEach((p,i) => {
    p.x += p.vx; p.y += p.vy; p.vy += .035; p.vx *= .992; p.vy *= .992; p.life -= p.decay;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle=`hsla(${p.hue},100%,72%,${Math.max(0,p.life)})`; ctx.fill();
    if(p.life<=0) particles.splice(i,1);
  });

  requestAnimationFrame(fireworkFrame);
}
function startFireworks() {
  fireworkRunning = true;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  // The first and most important burst comes from the middle of the screen.
  launchFirework(innerWidth/2, innerHeight*.43);
  setTimeout(() => launchFirework(innerWidth*.28, innerHeight*.30), 650);
  setTimeout(() => launchFirework(innerWidth*.72, innerHeight*.30), 1100);
  setTimeout(() => launchFirework(innerWidth/2, innerHeight*.25), 1650);
  const loop = setInterval(() => {
    if (currentScene !== 9) { clearInterval(loop); return; }
    launchFirework(innerWidth/2 + (Math.random()-.5)*innerWidth*.55, innerHeight*(.22+Math.random()*.35));
  }, 1250);
  fireworkFrame();
  burstConfetti();
}

// ---------- SIMPLE EFFECTS ----------
function burstAt(x,y) {
  const e = document.createElement("div");
  e.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:50%;background:#ffd86b;box-shadow:0 0 20px #ffd86b;z-index:100;pointer-events:none;`;
  document.body.appendChild(e);
  e.animate([{transform:"scale(1)",opacity:1},{transform:"scale(5)",opacity:0}],{duration:500});
  setTimeout(()=>e.remove(),500);
}
function burstConfetti() {
  for(let i=0;i<45;i++){
    const c=document.createElement("span");
    c.textContent=["✦","✧","•","♥","✺"][Math.floor(Math.random()*5)];
    c.style.cssText=`position:fixed;z-index:100;left:${50+(Math.random()-.5)*20}%;top:${48+(Math.random()-.5)*10}%;font-size:${10+Math.random()*18}px;color:hsl(${Math.random()*360},100%,75%);pointer-events:none;`;
    document.body.appendChild(c);
    const x=(Math.random()-.5)*innerWidth*.9, y=(Math.random()-.5)*innerHeight*.9;
    c.animate([{transform:"translate(0,0) scale(.5)",opacity:1},{transform:`translate(${x}px,${y}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:1000+Math.random()*900,easing:"cubic-bezier(.1,.7,.2,1)"});
    setTimeout(()=>c.remove(),2000);
  }
}

// ---------- PERSONALIZE UI ----------
$("#final-name").textContent = `For ${CONFIG.name} — with a little extra magic ✨`;
