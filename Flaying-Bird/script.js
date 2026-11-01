/* ============================================================
   ULTIMATE FLIGHT — MAIN GAME SETTINGS
   Replace the image/audio paths in this section with your files.
   Keep your images inside the "assets" folder.
   ============================================================ */

/* ---------- IMAGE PLACEHOLDERS ---------- */
// Replace this with the image you upload for the general/default game profile.
const DEFAULT_PROFILE_IMAGE_URL = "https://raw.githubusercontent.com/CHANTY-36/Testing/refs/heads/main/Memes/1793545464179.png";

// A custom player's uploaded photo is used locally in this browser only.
// It is NOT uploaded to a server and is not saved permanently.

/* ---------- AUDIO PLACEHOLDERS: SIX SEPARATE SOUNDS ---------- */
// 1. INTRO AUDIO — retained as a replaceable audio slot; profile selection now opens first.
const INTRO_AUDIO_URL = "chanty.mp3";

// 2. PROFILE SELECTION AUDIO — plays when the profile selection screen opens.
const PROFILE_SELECTION_AUDIO_URL = "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/niranjan.mp3";

// 3. NEAR-MISS AUDIO — plays once when the player narrowly avoids a pillar/ground.
const NEAR_MISS_AUDIO_URL = "chanty.mp3";

// 4. PILLAR-CROSSED AUDIO — plays every time one pillar pair is passed successfully.
const PILLAR_CROSSED_AUDIO_URL = "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/sathireddy_1.mp3";

// 5. VICTORY AUDIO — plays after the player passes all 10 pillars.
const VICTORY_AUDIO_URL = "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/sairamsairam.mp3";

// 6. GAME-OVER AUDIO — plays when the player hits a pillar or the ground.
const GAME_OVER_AUDIO_URL = "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/nagantalogame_1.mp3";

/* ---------- GAME SETTINGS ---------- */
const TOTAL_PILLARS_TO_WIN = 10;
const WORLD = { width: 1000, height: 700, groundHeight: 54 };
const DIFFICULTY = {
  easy:   { speed: 2.50, gap: 200, gravity: 0.25, flap: -6.5 },
  medium: { speed: 3.00, gap: 175, gravity: 0.30, flap: -6.8 },
  hard:   { speed: 3.50, gap: 150, gravity: 0.35, flap: -7.1 }
};

const $ = (id) => document.getElementById(id);
const screens = ["profileScreen", "readyScreen", "gameScreen", "resultScreen"];
const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");

let selectedProfile = null;
let customPhotoUrl = null;
let selectedAvatarUrl = null;
let muted = false;
let audioUnlocked = false;
let currentAudio = null;
const sounds = {};

function createAudio(name, url, loop = false, volume = 0.65) {
  const audio = new Audio(url);
  audio.preload = "auto";
  audio.loop = loop;
  audio.volume = volume;
  audio.muted = muted;
  sounds[name] = audio;
  return audio;
}
createAudio("intro", INTRO_AUDIO_URL, true, 0.35);
createAudio("profile", PROFILE_SELECTION_AUDIO_URL, false, 0.55);
createAudio("nearMiss", NEAR_MISS_AUDIO_URL, false, 0.99);
createAudio("pillar", PILLAR_CROSSED_AUDIO_URL, false, 0.7);
createAudio("victory", VICTORY_AUDIO_URL, false, 0.8);
createAudio("gameOver", GAME_OVER_AUDIO_URL, false, 0.8);

function stopAllAudio() {
  Object.values(sounds).forEach(a => { a.pause(); a.currentTime = 0; });
  currentAudio = null;
}
function playSound(name, restart = true) {
  if (muted || !sounds[name]) return;
  const a = sounds[name];
  if (restart) a.currentTime = 0;
  a.muted = false;
  a.play().catch(() => {});
}
function playLoop(name) {
  stopAllAudio();
  if (!muted && sounds[name]) {
    currentAudio = sounds[name];
    currentAudio.loop = true;
    currentAudio.play().catch(() => {});
  }
}
function unlockAudio() { audioUnlocked = true; }

function showScreen(id) {
  screens.forEach(s => $(s).classList.toggle("active", s === id));
}
function setProfileChoice(choice) {
  selectedProfile = choice;
  $("customProfileBtn").classList.toggle("selected", choice === "custom");
  $("defaultProfileBtn").classList.toggle("selected", choice === "default");
  $("profileContinueBtn").disabled = !choice;
  if (choice === "custom" && !customPhotoUrl) {
    $("profileHint").textContent = "Choose a photo from your device to use as your character.";
  } else {
    $("profileHint").textContent = choice === "custom" ? "Your photo is ready!" : "Default game character selected.";
  }
}
function openProfileScreen() {
  stopAllAudio();
  showScreen("profileScreen");
  playSound("profile");
}
function selectProfileAndContinue() {
  if (!selectedProfile) return;
  if (selectedProfile === "custom" && !customPhotoUrl) {
    $("photoInput").click();
    return;
  }
  selectedAvatarUrl = selectedProfile === "custom" ? customPhotoUrl : DEFAULT_PROFILE_IMAGE_URL;
  $("readyAvatar").src = selectedAvatarUrl;
  $("readyAvatar").onerror = () => { $("readyAvatar").src = makeFallbackAvatar(); };
  showScreen("readyScreen");
}
function makeFallbackAvatar() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#273457"/><text x="50%" y="58%" text-anchor="middle" font-size="90">🐦</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

$("defaultPreviewImg").src = DEFAULT_PROFILE_IMAGE_URL;
$("defaultPreviewImg").onerror = () => { $("defaultPreviewImg").src = makeFallbackAvatar(); };
$("customProfileBtn").addEventListener("click", () => {
  unlockAudio(); setProfileChoice("custom"); $("photoInput").click();
});
$("defaultProfileBtn").addEventListener("click", () => { unlockAudio(); setProfileChoice("default"); });
$("photoInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    $("profileHint").textContent = "Please choose an image file.";
    return;
  }
  if (customPhotoUrl) URL.revokeObjectURL(customPhotoUrl);
  customPhotoUrl = URL.createObjectURL(file);
  $("customProfileBtn").querySelector(".profile-preview").innerHTML = `<img src="${customPhotoUrl}" alt="Your uploaded profile photo">`;
  setProfileChoice("custom");
  $("profileHint").textContent = "Photo selected. It stays on this device for this game session.";
});
$("profileContinueBtn").addEventListener("click", selectProfileAndContinue);
document.querySelectorAll(".back-btn").forEach(btn => btn.addEventListener("click", () => {
  showScreen(btn.dataset.back);
  if (btn.dataset.back === "profileScreen") playSound("profile");
}));

/* ---------------- GAME ENGINE ---------------- */
const game = {
  state: "ready", score: 0, pillarsCreated: 0, player: { x: 185, y: 330, vy: 0, radius: 31 },
  pillars: [], frame: 0, difficulty: DIFFICULTY.medium, nearMissArmed: true,
  particles: [], lastTime: 0
};

function resetGame() {
  game.score = 0;
  game.pillarsCreated = 0;
  game.frame = 0;
  game.player = { x: 185, y: WORLD.height * 0.48, vy: 0, radius: 31 };
  game.pillars = [];
  game.particles = [];
  game.nearMissArmed = true;
  for (let i = 0; i < 3; i++) game.pillars.push(makePillar(WORLD.width + 100 + i * 300));
  $("scoreText").textContent = `0 / ${TOTAL_PILLARS_TO_WIN}`;
  $("gameOverlay").classList.remove("show");
}
function makePillar(x) {
  const gap = game.difficulty.gap;
  const margin = 95;
  const top = margin + Math.random() * (WORLD.height - WORLD.groundHeight - gap - margin * 2);
  game.pillarsCreated++;
  return { x, width: 82, gapY: top, gapH: gap, passed: false, number: game.pillarsCreated, golden: game.pillarsCreated === 5 };
}
function beginGame() {
  game.difficulty = DIFFICULTY[$("difficultySelect").value] || DIFFICULTY.medium;
  resetGame();
  game.state = "playing";
  stopAllAudio();
  showScreen("gameScreen");
  flap();
  game.lastTime = performance.now();
  requestAnimationFrame(loop);
}
function flap() {
  if (game.state !== "playing") return;
  game.player.vy = game.difficulty.flap;
}
function pauseGame() {
  if (game.state !== "playing") return;
  game.state = "paused";
  $("gameOverlay").classList.add("show");
}
function resumeGame() {
  if (game.state !== "paused") return;
  game.state = "playing";
  $("gameOverlay").classList.remove("show");
  game.lastTime = performance.now();
  requestAnimationFrame(loop);
}
function finishGame(won) {
  if (game.state !== "playing") return;
  game.state = won ? "won" : "lost";
  stopAllAudio();
  playSound(won ? "victory" : "gameOver");
  $("resultIcon").textContent = won ? "🏆" : "💥";
  $("resultEyebrow").textContent = won ? "FLIGHT COMPLETE" : "END OF THE FLIGHT";
  $("resultTitle").innerHTML = won ? 'YOU <span>WIN!</span>' : 'GAME <span>OVER</span>';
  $("resultMessage").textContent = won
    ? "Amazing! You crossed all 10 pillars. You're a flying champion!"
    : "That was close! Take another try and cross all 10 pillars.";
  $("finalScore").textContent = `${game.score} / ${TOTAL_PILLARS_TO_WIN}`;
  $("winnerAvatar").src = selectedAvatarUrl || makeFallbackAvatar();
  $("winnerAvatar").onerror = () => { $("winnerAvatar").src = makeFallbackAvatar(); };
  showScreen("resultScreen");
  if (won) celebrationBurst();
}
function celebrationBurst() {
  const layer = $("celebrationLayer");
  layer.innerHTML = "";
  for (let i = 0; i < 55; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--drift", `${(Math.random() - .5) * 180}px`);
    piece.style.animationDelay = `${Math.random() * .9}s`;
    layer.appendChild(piece);
  }
}

function isNearMiss() {
  const p = game.player;
  const floorY = WORLD.height - WORLD.groundHeight;
  const nearGround = floorY - (p.y + p.radius) < 18 && p.y + p.radius < floorY;
  let nearPillar = false;
  for (const pipe of game.pillars) {
    const overlapsX = p.x + p.radius > pipe.x - 15 && p.x - p.radius < pipe.x + pipe.width + 15;
    if (!overlapsX) continue;
    const gapTop = pipe.gapY;
    const gapBottom = pipe.gapY + pipe.gapH;
    const clearanceTop = p.y - p.radius - gapTop;
    const clearanceBottom = gapBottom - (p.y + p.radius);
    if ((clearanceTop >= 0 && clearanceTop < 16) || (clearanceBottom >= 0 && clearanceBottom < 16)) {
      nearPillar = true; break;
    }
  }
  const near = nearGround || nearPillar;
  if (near && game.nearMissArmed) {
    playSound("nearMiss");
    game.nearMissArmed = false;
  }
  if (!near) game.nearMissArmed = true;
}
function collided() {
  const p = game.player;
  const floorY = WORLD.height - WORLD.groundHeight;
  if (p.y - p.radius < 0 || p.y + p.radius > floorY) return true;
  for (const pipe of game.pillars) {
    const hitX = p.x + p.radius > pipe.x && p.x - p.radius < pipe.x + pipe.width;
    if (hitX) {
      const outsideGap = p.y - p.radius < pipe.gapY || p.y + p.radius > pipe.gapY + pipe.gapH;
      if (outsideGap) return true;
    }
  }
  return false;
}
function update(dt) {
  const p = game.player;
  p.vy += game.difficulty.gravity * dt;
  p.y += p.vy * dt;
  game.pillars.forEach(pipe => {
    pipe.x -= game.difficulty.speed * dt;
    if (!pipe.passed && pipe.x + pipe.width < p.x - p.radius) {
      pipe.passed = true;
      game.score++;
      $("scoreText").textContent = `${game.score} / ${TOTAL_PILLARS_TO_WIN}`;
      playSound("pillar");
      if (game.score >= TOTAL_PILLARS_TO_WIN) {
        finishGame(true);
      }
    }
  });
  if (game.state !== "playing") return;
  if (game.pillarsCreated < TOTAL_PILLARS_TO_WIN && game.pillars[game.pillars.length - 1].x < WORLD.width - 270) {
    game.pillars.push(makePillar(WORLD.width + 60));
  }
  game.pillars = game.pillars.filter(pipe => pipe.x + pipe.width > -10);
  isNearMiss();
  if (collided()) finishGame(false);
}
function drawBackground() {
  const stage = game.score < 4 ? 0 : game.score < 7 ? 1 : 2;
  const palettes = [
    ["#123c55", "#1b6b78", "#5ab9a7"],
    ["#182b55", "#3d397a", "#7d65b8"],
    ["#071a38", "#183f68", "#276c82"]
  ];
  const palette = palettes[stage];
  const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  gradient.addColorStop(0, palette[0]); gradient.addColorStop(.58, palette[1]); gradient.addColorStop(1, palette[2]);
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  // Floating aurora ribbons and softly glowing stars.
  ctx.save();
  ctx.globalAlpha = .28;
  for (let band = 0; band < 3; band++) {
    ctx.beginPath();
    for (let x = 0; x <= WORLD.width; x += 12) {
      const y = 110 + band * 105 + Math.sin((x + game.frame * (0.7 + band * .18)) / 75) * (28 + band * 7);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = stage === 1 ? "#d0a8ff" : "#75ffe1";
    ctx.lineWidth = 24; ctx.lineCap = "round"; ctx.stroke();
  }
  ctx.restore();
  for (let i = 0; i < 42; i++) {
    const x = (i * 197 + 31) % WORLD.width;
    const y = (i * 113 + 27) % (WORLD.height - WORLD.groundHeight - 35);
    const twinkle = .35 + (Math.sin(game.frame * .06 + i) + 1) * .25;
    ctx.fillStyle = `rgba(230,255,255,${twinkle})`;
    ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 2.2 : 1.2, 0, Math.PI * 2); ctx.fill();
  }
  // Soft distant planet glow shifts as the player advances.
  const planetX = stage === 0 ? 650 : stage === 1 ? 150 : 660;
  const glow = ctx.createRadialGradient(planetX, 145, 8, planetX, 145, 120);
  glow.addColorStop(0, stage === 1 ? "rgba(211,174,255,.45)" : "rgba(105,255,222,.36)");
  glow.addColorStop(1, "rgba(105,255,222,0)");
  ctx.fillStyle = glow; ctx.fillRect(planetX - 125, 20, 250, 250);
}
function drawPillar(pipe) {
  const topH = pipe.gapY;
  const bottomY = pipe.gapY + pipe.gapH;
  const floorY = WORLD.height - WORLD.groundHeight;
  const drawTube = (x, y, w, h, isTop) => {
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    if (pipe.golden) {
      grad.addColorStop(0, "#8c5d20"); grad.addColorStop(.28, "#ffd86b"); grad.addColorStop(.7, "#e8a936"); grad.addColorStop(1, "#80501b");
    } else {
      grad.addColorStop(0, "#087b79"); grad.addColorStop(.25, "#29c8b2"); grad.addColorStop(.7, "#168e9b"); grad.addColorStop(1, "#075568");
    }
    ctx.fillStyle = grad; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = pipe.golden ? "#fff0a5" : "#9affed"; ctx.fillRect(x + 8, y, 7, h);
    ctx.fillStyle = pipe.golden ? "#8c5d20" : "#075568"; ctx.fillRect(x + w - 9, y, 6, h);
    const capY = isTop ? y + h - 20 : y;
    ctx.fillStyle = pipe.golden ? "#d99a2d" : "#087b79"; ctx.fillRect(x - 7, capY, w + 14, 20);
    ctx.strokeStyle = pipe.golden ? "#fff0a5" : "#a4fff0"; ctx.lineWidth = 2; ctx.strokeRect(x - 7, capY, w + 14, 20);
  };
  drawTube(pipe.x, 0, pipe.width, topH, true);
  drawTube(pipe.x, bottomY, pipe.width, floorY - bottomY, false);
}
function drawPlayer() {
  const p = game.player;
  ctx.save();
  ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
  if (selectedAvatarUrl) {
    const img = avatarImage();
    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
    else drawBirdFallback(p);
  } else drawBirdFallback(p);
  ctx.restore();
  // Animated wing-shaped highlight gives the avatar a flying motion.
  ctx.beginPath();
  ctx.ellipse(p.x - 9, p.y + Math.sin(game.frame * .28) * 5, 13, 7 + Math.abs(Math.sin(game.frame * .28)) * 5, -0.45, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,.28)"; ctx.fill();
  ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.strokeStyle = "#d5fff8"; ctx.lineWidth = 4; ctx.stroke();
}
let cachedAvatar = null, cachedAvatarUrl = null;
function avatarImage() {
  if (!selectedAvatarUrl) return null;
  if (cachedAvatarUrl !== selectedAvatarUrl) {
    cachedAvatar = new Image(); cachedAvatar.src = selectedAvatarUrl; cachedAvatarUrl = selectedAvatarUrl;
  }
  return cachedAvatar;
}
function drawBirdFallback(p) {
  ctx.fillStyle = "#66f0d0"; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.x + 10, p.y - 9, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#102638"; ctx.beginPath(); ctx.arc(p.x + 13, p.y - 9, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#9b8cff"; ctx.beginPath(); ctx.moveTo(p.x + 19, p.y + 2); ctx.lineTo(p.x + 34, p.y + 8); ctx.lineTo(p.x + 19, p.y + 14); ctx.fill();
}
function drawGround() {
  const y = WORLD.height - WORLD.groundHeight;
  ctx.fillStyle = "#d8b66f"; ctx.fillRect(0, y, WORLD.width, WORLD.groundHeight);
  ctx.fillStyle = "#75b978"; ctx.fillRect(0, y, WORLD.width, 12);
  ctx.fillStyle = "#b99454";
  for (let x = -((game.frame * game.difficulty.speed) % 40); x < WORLD.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, y + 22); ctx.lineTo(x + 18, y + 22); ctx.lineTo(x + 10, y + 27); ctx.fill();
  }
}
function drawFinishTarget() {
  // A glowing finish marker takes the place of an 11th pillar.
  if (game.pillarsCreated !== TOTAL_PILLARS_TO_WIN || game.score >= TOTAL_PILLARS_TO_WIN) return;
  const finalPillar = game.pillars.find(pipe => pipe.number === TOTAL_PILLARS_TO_WIN);
  if (!finalPillar) return;
  const x = finalPillar.x + finalPillar.width + 155;
  const y = WORLD.height * 0.48;
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "#8affed";
  ctx.shadowBlur = 24;
  ctx.strokeStyle = "#c8fff4";
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(0, 0, 36, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "rgba(102,240,208,.2)";
  ctx.beginPath(); ctx.arc(0, 0, 25, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f4ffff";
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FINISH", 0, 5);
  ctx.restore();
}
function draw() {
  drawBackground();
  game.pillars.forEach(drawPillar);
  drawFinishTarget();
  drawGround();
  drawPlayer();
  game.frame++;
}
function loop(now) {
  if (game.state !== "playing") return;
  const dt = Math.min((now - game.lastTime) / 16.67, 2);
  game.lastTime = now;
  update(dt);
  draw();
  if (game.state === "playing") requestAnimationFrame(loop);
}

/* ---------------- CONTROLS & BUTTONS ---------------- */
$("gameStartBtn").addEventListener("click", beginGame);
$("pauseBtn").addEventListener("click", pauseGame);
$("resumeBtn").addEventListener("click", resumeGame);
$("replayBtn").addEventListener("click", () => {
  $("difficultySelect").value = $("difficultySelect").value || "medium";
  showScreen("readyScreen");
});
$("changeProfileBtn").addEventListener("click", () => {
  selectedProfile = null;
  $("profileContinueBtn").disabled = true;
  $("customProfileBtn").classList.remove("selected");
  $("defaultProfileBtn").classList.remove("selected");
  openProfileScreen();
});
function handleFlapInput(event) {
  if (event && event.type === "keydown" && !["Space", "ArrowUp", "KeyW"].includes(event.code)) return;
  if (event && event.type === "keydown") event.preventDefault();
  if (game.state === "playing") flap();
}
$("gameScreen").addEventListener("pointerdown", (event) => {
  if (event.target.closest("#pauseBtn, #gameOverlay, #muteBtn")) return;
  handleFlapInput(event);
});
$("pauseBtn").addEventListener("pointerdown", event => event.stopPropagation());
$("gameOverlay").addEventListener("pointerdown", event => event.stopPropagation());
document.addEventListener("keydown", handleFlapInput);
$("muteBtn").addEventListener("click", () => {
  muted = !muted;
  Object.values(sounds).forEach(a => a.muted = muted);
  $("muteBtn").textContent = muted ? "🔇 Sound Off" : "🔊 Sound On";
  if (!muted && game.state === "playing") { /* gameplay has no looping music by design */ }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && game.state === "playing") pauseGame();
});

// Start directly on profile selection; no separate intro/start page.
game.difficulty = DIFFICULTY.medium;
resetGame();
draw();
showScreen("profileScreen");
$("profileHint").textContent = "Choose your profile to begin your flight.";
document.addEventListener("pointerdown", function profileAudioUnlock() {
  playSound("profile");
  document.removeEventListener("pointerdown", profileAudioUnlock);
}, { once: true });
