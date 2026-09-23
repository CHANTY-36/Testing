/* CHAPTER 20 — PERSONALIZED BIRTHDAY STORY
   Change CONFIG below. Put your final photo at the path in finalPhoto.
*/

const CONFIG = {
  name: "To The Topper",
  finalPhoto: "assets/photos/birthday-person.jpg",

  message: `Happy Birthday Nageswari! 🎂
On 26-09-2004 a spark risers with courage and great attitude!
Twenty Three is more than just a number. It is the beginning of another beautiful chapter — full of new places, new memories, big dreams and tiny moments worth remembering.

I hope you always keep that spark that makes you💥,

May you laugh loudly, dream fearlessly and find a little magic in ordinary days🌟.

Here's to Chapter 23. ✨
With lots of happiness and warm wishes💙`,

  photos: [
    {
      src: "https://raw.githubusercontent.com/cha-nty/happybirthday-/refs/heads/main/IMG-20260922-WA0006.jpg",
      caption: "A memory that deserves its own little star."
    },
    {
      src: "",
      caption: "One moment. A thousand feelings."
    },
    {
      src: "",
      caption: "Some memories never really leave us."
    },
    {
      src: "",
      caption: "A page worth turning back to."
    },
    {
      src: "",
      caption: "The kind of moment you wish you could pause."
    },
    {
      src: "",
      caption: "More memories are waiting to be made."
    },
    {
      src: "",
      caption: "And this story is only getting started."
    }
  ],

  // These are interest-style questions. Change the correct answers if needed.
  quiz: [
    {
      q: "What Nageswari like to do most in free time?",
      answers: [
        "Watching phone 📱",
        "Listening to music 🎧",
        "Watching movies 🎬",
        "Sitting alone 🌙"
      ],
      correct: 1
    },

    {
      q: "What would Nageswari enjoy doing more?",
      answers: [
        "Travelling ✈️",
        "Cooking 🍳",
        "Playing 🎮",
        "Trying something completely new ✨"
      ],
      correct: 0
    },

    {
      q: "What does Nageswari Likes more?",
      answers: [
        "Cinema🎥",
        "Football⚽",
        "Cricket🏏",
        "All of the above"
      ],
      correct: 3
    },

    {
      q: "Which kind of day sounds most like by Nageswari?",
      answers: [
        "A peaceful day alone 🌙",
        "A fun day with friends 🫶",
        "An adventure somewhere new 🌍",
        "A cozy movie/music day 🎶"
      ],
      correct: 2
    }
  ]
};


/* =========================================================
   BASIC SELECTORS
========================================================= */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];


/* =========================================================
   MUSIC SYSTEM
   Play Music -> start music + move to Chapter 1
   Maybe Later -> no music + move to Chapter 1
========================================================= */

const music = $("#birthdayMusic");
const musicChoice = $("#music-choice");
const musicYes = $("#music-yes");
const musicNo = $("#music-no");

let musicStarted = false;

if (music) {
  music.volume = 0.65;
}


/* PLAY MUSIC BUTTON */

if (musicYes) {
  musicYes.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Close the music popup
    if (musicChoice) {
      musicChoice.classList.add("hidden");
    }

    // Try to play the music
    if (music && !musicStarted) {
      try {
        await music.play();
        musicStarted = true;
      } catch (error) {
        console.log("Music could not start:", error);
        showToast("Music is ready 🎵");
      }
    }

    // Go to the next chapter
    setTimeout(() => {
      goToScene(1);
    }, 250);
  };
}


/* MAYBE LATER BUTTON */

if (musicNo) {
  musicNo.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Close popup
    if (musicChoice) {
      musicChoice.classList.add("hidden");
    }

    // Continue to Chapter 1 without music
    setTimeout(() => {
      goToScene(1);
    }, 250);
  };
}


/* =========================================================
   SCENE SYSTEM
========================================================= */

let currentScene = 0;
let audioStarted = false;

function goToScene(n) {
  const old = $(`#scene-${currentScene}`);
  const next = $(`#scene-${n}`);

  if (!next || n === currentScene) return;

  if (old) {
    old.classList.remove("active");
    old.classList.add("exit");

    setTimeout(() => {
      old.classList.remove("exit");
    }, 800);
  }

  next.classList.add("active");
  currentScene = n;

  if (n === 7) startCountdown();
  if (n === 8) startTypewriter();
  if (n === 9) startFireworks();
}


/* =========================================================
   BACKUP AUDIO FUNCTION
========================================================= */

function startAudio() {
  if (musicStarted) return;

  if (music) {
    music.play()
      .then(() => {
        musicStarted = true;

        const soundHint = $("#soundHint");

        if (soundHint) {
          soundHint.style.opacity = "0";
        }
      })
      .catch(() => {});
  }
}


/* NEXT BUTTONS */

$$("[data-next]").forEach(b => {
  b.onclick = () => {
    startAudio();
    goToScene(+b.dataset.next);
  };
});


/* =========================================================
   PORTALS
========================================================= */

$$(".portal").forEach(b => {
  b.onclick = () => {

    $("#portal-result").textContent =
      b.dataset.portal === "A"
        ? "The moon chose you. ✦"
        : "The dream opened. ∞";

    setTimeout(() => goToScene(2), 900);
  };
});


/* =========================================================
   ORB
   Every tap creates a different event
========================================================= */

let orbCount = 0;

const orbEvents = [
  "A tiny spark woke up. ✨",
  "The light remembers something… 🌙",
  "A secret star just appeared. ⭐",
  "The orb is getting brighter…",
  "Something magical is getting closer. 🪄",
  "One more tap… don't stop now. 👀",
  "The wish is awake! 💫"
];

$("#orb").onclick = () => {

  orbCount++;

  $("#orb-count").textContent = orbCount;

  $("#orb-event").textContent = orbEvents[orbCount - 1];

  const orb = $("#orb");

  orb.classList.remove("orb-active");

  void orb.offsetWidth;

  orb.classList.add("orb-active");

  createOrbBurst();

  if (orbCount >= 7) {
    setTimeout(() => goToScene(3), 800);
  }
};


function createOrbBurst() {

  const orb = $("#orb");

  const r = orb.getBoundingClientRect();

  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  for (let i = 0; i < 9; i++) {

    const s = document.createElement("span");

    s.textContent =
      ["✦", "✧", "•", "✨"][Math.floor(Math.random() * 4)];

    s.style.cssText =
      `position:fixed;
       z-index:100;
       left:${cx}px;
       top:${cy}px;
       color:hsl(${180 + Math.random() * 150},100%,75%);
       font-size:${10 + Math.random() * 13}px;
       pointer-events:none`;

    document.body.appendChild(s);

    const a = Math.random() * Math.PI * 2;
    const d = 45 + Math.random() * 90;

    s.animate(
      [
        {
          transform: "translate(-50%,-50%) scale(.2)",
          opacity: 1
        },
        {
          transform:
            `translate(${Math.cos(a) * d}px,
             ${Math.sin(a) * d}px)
             scale(1.5)`,
          opacity: 0
        }
      ],
      {
        duration: 650,
        easing: "cubic-bezier(.1,.7,.2,1)"
      }
    );

    setTimeout(() => s.remove(), 700);
  }
}


/* =========================================================
   GIFT — EXACTLY TWO TAPS
========================================================= */

let giftCount = 0;

$("#gift").onclick = () => {

  if (giftCount >= 2) return;

  giftCount++;

  $("#gift-count").textContent = giftCount;

  $("#gift").animate(
    [
      {
        transform: "scale(1)"
      },
      {
        transform: "scale(1.06) rotate(-2deg)"
      },
      {
        transform: "scale(1)"
      }
    ],
    {
      duration: 300
    }
  );

  if (giftCount === 2) {

    $("#gift").classList.add("open");

    burstConfetti();

    showToast("Here we go! ✨");

    setTimeout(() => goToScene(4), 1300);
  }
};


/* =========================================================
   MEMORY
========================================================= */

let memoryIndex = 0;

function renderMemory() {

  const item = CONFIG.photos[memoryIndex];

  $("#memory-number").textContent =
    String(memoryIndex + 1).padStart(2, "0");

  $("#memory-caption").textContent =
    item.caption;

  const photo = $("#memory-photo");

  if (item.src) {

    photo.style.backgroundImage =
      `url("${item.src}")`;

    photo.innerHTML = "";

  } else {

    photo.style.backgroundImage = "";

    photo.innerHTML =
      `<div class="photo-placeholder">
        YOUR PHOTO ${String(memoryIndex + 1).padStart(2, "0")}
      </div>`;
  }

  $("#memory-dots").innerHTML =
    CONFIG.photos
      .map(
        (_, i) =>
          `<span class="dot ${i === memoryIndex ? "active" : ""}"></span>`
      )
      .join("");
}


function memoryMove(dir) {

  memoryIndex =
    (memoryIndex + dir + CONFIG.photos.length) %
    CONFIG.photos.length;

  $("#memory-card").animate(
    [
      {
        transform:
          `translateX(${dir > 0 ? 25 : -25}px)`,
        opacity: 0.25
      },
      {
        transform: "translateX(0)",
        opacity: 1
      }
    ],
    {
      duration: 360
    }
  );

  renderMemory();

  if (memoryIndex === CONFIG.photos.length - 1) {

    setTimeout(() => goToScene(5), 900);
  }
}


$("#memory-next").onclick = () => memoryMove(1);

$("#memory-prev").onclick = () => memoryMove(-1);


let touchStartX = 0;

$("#memory-card").ontouchstart = e => {
  touchStartX = e.changedTouches[0].clientX;
};

$("#memory-card").ontouchend = e => {

  const dx =
    e.changedTouches[0].clientX - touchStartX;

  if (Math.abs(dx) > 40) {
    memoryMove(dx < 0 ? 1 : -1);
  }
};

renderMemory();


/* =========================================================
   STAR GAME
   50 STARS
========================================================= */

const game = $("#star-game");
const player = $("#player");

let gameRunning = false;
let score = 0;
let misses = 0;
let timeLeft = 30;
let stars = [];
let gameTimer;
let spawnTimer;
let rafId;


function movePlayer(x, y) {

  const r = game.getBoundingClientRect();

  player.style.left =
    `${Math.max(
      25,
      Math.min(r.width - 25, x - r.left)
    )}px`;

  player.style.top =
    `${Math.max(
      25,
      Math.min(r.height - 25, y - r.top)
    )}px`;
}


game.onpointermove = e => {

  if (gameRunning) {
    movePlayer(e.clientX, e.clientY);
  }
};


game.onpointerdown = e => {

  if (gameRunning) {
    movePlayer(e.clientX, e.clientY);
  }
};


function spawnStar() {

  if (!gameRunning) return;

  const el = document.createElement("div");

  el.className = "falling-star";

  el.style.left =
    `${Math.random() * 90 + 5}%`;

  el.style.top = "-30px";

  game.appendChild(el);

  stars.push({
    el,
    y: -50,
    speed: 3.5 + Math.random() * 3.5
  });
}


function gameLoop() {

  if (!gameRunning) return;

  const pr = player.getBoundingClientRect();

  for (let i = stars.length - 1; i >= 0; i--) {

    const s = stars[i];

    s.y += s.speed;

    s.el.style.top = `${s.y}px`;

    const sr = s.el.getBoundingClientRect();

    const dx =
      sr.left +
      sr.width / 2 -
      (pr.left + pr.width / 2);

    const dy =
      sr.top +
      sr.height / 2 -
      (pr.top + pr.height / 2);

    if (Math.hypot(dx, dy) < 40) {

      s.el.remove();

      stars.splice(i, 1);

      score++;

      $("#score").textContent = score;

      burstAt(
        sr.left + sr.width / 2,
        sr.top + sr.height / 2
      );

      if (score >= 50) {
        endGame(true);
      }

    } else if (s.y > game.clientHeight + 40) {

      s.el.remove();

      stars.splice(i, 1);

      misses++;

      $("#misses").textContent = misses;

      if (misses > 1) {
        endGame(false);
        return;
      }
    }
  }

  rafId = requestAnimationFrame(gameLoop);
}


function resetStars() {

  stars.forEach(s => s.el.remove());

  stars = [];

  score = 0;
  misses = 0;
  timeLeft = 30;

  $("#score").textContent = "0";
  $("#misses").textContent = "0";
  $("#time").textContent = "30";
}


function startGame() {

  if (gameRunning) return;

  resetStars();

  gameRunning = true;

  $("#game-message").style.display = "none";

  $("#start-game").textContent =
    "Game running…";

  spawnTimer =
    setInterval(spawnStar, 520);

  gameTimer =
    setInterval(() => {

      timeLeft--;

      $("#time").textContent =
        timeLeft;

      if (timeLeft <= 0) {
        endGame(false);
      }

    }, 1000);

  requestAnimationFrame(gameLoop);
}


function endGame(won) {

  if (!gameRunning) return;

  gameRunning = false;

  clearInterval(spawnTimer);
  clearInterval(gameTimer);

  cancelAnimationFrame(rafId);

  stars.forEach(s => s.el.remove());

  stars = [];

  if (won) {

    $("#game-message").textContent =
      "50 stars caught! You did it. ✨";

    $("#game-message").style.display =
      "grid";

    $("#start-game").textContent =
      "Continue →";

    burstConfetti();

    setTimeout(() => goToScene(6), 1000);

  } else {

    $("#game-message").textContent =
      misses > 1
        ? "Too many missed stars! The challenge is starting again…"
        : "Time's up! Try the 50-star challenge again.";

    $("#game-message").style.display =
      "grid";

    $("#start-game").textContent =
      "Start again";
  }
}


$("#start-game").onclick = () =>
  score >= 50
    ? goToScene(6)
    : startGame();


/* =========================================================
   QUIZ — INTEREST QUESTIONS
========================================================= */

let quizIndex = 0;

function renderQuiz() {

  const q = CONFIG.quiz[quizIndex];

  $("#quiz-progress").style.width =
    `${quizIndex / CONFIG.quiz.length * 100}%`;

  $("#quiz-content").innerHTML =
    `<div class="question">${q.q}</div>
     <div class="answers">
       ${q.answers
         .map(
           (a, i) =>
             `<button class="answer" data-answer="${i}">
                ${a}
              </button>`
         )
         .join("")}
     </div>`;

  $$(".answer").forEach(b => {

    b.onclick = () => {

      const selected =
        +b.dataset.answer;

      // These questions are for exploration,
      // so every answer is accepted.

      b.classList.add("correct");

      showToast(
        ` ${q.answers[selected]}`
      );

      if (quizIndex < CONFIG.quiz.length - 1) {

        quizIndex++;

        setTimeout(
          renderQuiz,
          600
        );

      } else {

        $("#quiz-progress").style.width =
          "100%";

        setTimeout(
          () => goToScene(7),
          800
        );
      }
    };
  });
}

renderQuiz();


/* =========================================================
   COUNTDOWN
========================================================= */

let countdownStarted = false;

function startCountdown() {

  if (countdownStarted) return;

  countdownStarted = true;

  let n = 3;

  $("#countdown").textContent = n;

  const t = setInterval(() => {

    n--;

    if (n <= 0) {

      clearInterval(t);

      $("#countdown").textContent =
        "✨";

      setTimeout(
        () => goToScene(8),
        850
      );

    } else {

      $("#countdown").textContent =
        n;
    }

  }, 1000);
}


/* =========================================================
   TYPEWRITER
========================================================= */

let typingStarted = false;

function startTypewriter() {

  if (typingStarted) return;

  typingStarted = true;

  const target = $("#typewriter");

  const text = CONFIG.message;

  let i = 0;

  const tick = () => {

    if (i < text.length) {

      target.textContent +=
        text[i++];

      setTimeout(
        tick,
        text[i - 1] === "\n"
          ? 250
          : 32
      );

    } else {

      $("#message-next")
        .classList
        .remove("hidden");
    }
  };

  tick();
}


$("#message-next").onclick =
  () => goToScene(9);


/* =========================================================
   FIREWORKS
========================================================= */

const canvas = $("#fireworks");
const ctx = canvas.getContext("2d");

let particles = [];
let rockets = [];
let fireworkRunning = false;


function resizeCanvas() {

  const dpr =
    Math.min(
      devicePixelRatio || 1,
      2
    );

  canvas.width =
    innerWidth * dpr;

  canvas.height =
    innerHeight * dpr;

  canvas.style.width =
    innerWidth + "px";

  canvas.style.height =
    innerHeight + "px";

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}


addEventListener(
  "resize",
  resizeCanvas
);

resizeCanvas();


function launchFirework(
  x = innerWidth / 2,
  y = innerHeight * 0.42
) {

  rockets.push({
    x:
      innerWidth / 2 +
      (Math.random() - 0.5) * 40,

    y:
      innerHeight + 20,

    tx:
      x +
      (Math.random() - 0.5) * 90,

    ty:
      y +
      (Math.random() - 0.5) * 90,

    speed:
      8 +
      Math.random() * 2.5,

    hue:
      Math.random() * 360
  });
}


function explode(x, y, hue) {

  for (let i = 0; i < 110; i++) {

    const a =
      Math.random() *
      Math.PI *
      2;

    const s =
      Math.random() * 6 +
      1.5;

    particles.push({
      x,
      y,

      vx:
        Math.cos(a) * s,

      vy:
        Math.sin(a) * s,

      life: 1,

      decay:
        0.008 +
        Math.random() * 0.012,

      hue:
        hue +
        (Math.random() - 0.5) * 35,

      size:
        Math.random() * 2.5 + 1
    });
  }
}


function fireworkFrame() {

  if (!fireworkRunning) return;

  ctx.fillStyle =
    "rgba(9,0,20,.18)";

  ctx.fillRect(
    0,
    0,
    innerWidth,
    innerHeight
  );


  /* ROCKETS */

  for (
    let i = rockets.length - 1;
    i >= 0;
    i--
  ) {

    const r = rockets[i];

    const dx =
      r.tx - r.x;

    const dy =
      r.ty - r.y;

    const d =
      Math.hypot(dx, dy);

    r.x +=
      dx / d *
      r.speed;

    r.y +=
      dy / d *
      r.speed;

    ctx.beginPath();

    ctx.arc(
      r.x,
      r.y,
      2,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `hsla(${r.hue},100%,75%,1)`;

    ctx.fill();

    if (d < 12) {

      explode(
        r.x,
        r.y,
        r.hue
      );

      rockets.splice(i, 1);
    }
  }


  /* PARTICLES */

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    p.vy += 0.035;

    p.vx *= 0.992;
    p.vy *= 0.992;

    p.life -= p.decay;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `hsla(
        ${p.hue},
        100%,
        72%,
        ${Math.max(0, p.life)}
      )`;

    ctx.fill();

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(
    fireworkFrame
  );
}


function startFireworks() {

  if (fireworkRunning) return;

  fireworkRunning = true;

  resizeCanvas();

  ctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );

  // Hero burst starts from the middle of the screen.

  launchFirework(
    innerWidth / 2,
    innerHeight * 0.42
  );

  setTimeout(
    () =>
      launchFirework(
        innerWidth * 0.28,
        innerHeight * 0.30
      ),
    650
  );

  setTimeout(
    () =>
      launchFirework(
        innerWidth * 0.72,
        innerHeight * 0.30
      ),
    1100
  );

  setTimeout(
    () =>
      launchFirework(
        innerWidth / 2,
        innerHeight * 0.25
      ),
    1650
  );


  const loop =
    setInterval(() => {

      if (currentScene !== 9) {

        clearInterval(loop);

        r
