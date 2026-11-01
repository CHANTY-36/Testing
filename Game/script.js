/* ============================================================
   ULTIMATE FLIGHT — MAIN GAME SETTINGS
   Replace the image/audio paths in this section with your files.
   Keep your images inside the "assets" folder.
   ============================================================ */

/* ---------- IMAGE PLACEHOLDERS ---------- */
// Replace this with the image you upload for the general/default game profile.
const DEFAULT_PROFILE_IMAGE_URL = "assets/default-character.png";

// A custom player's uploaded photo is used locally in this browser only.
// It is NOT uploaded to a server and is not saved permanently.

/* ---------- AUDIO PLACEHOLDERS: SIX SEPARATE SOUNDS ---------- */
// 1. INTRO AUDIO — plays on the intro screen after the first user interaction.
const INTRO_AUDIO_URL = "assets/audio/intro-theme.mp3";

// 2. PROFILE SELECTION AUDIO — plays when the profile selection screen opens.
const PROFILE_SELECTION_AUDIO_URL = "assets/audio/profile-selection.mp3";

// 3. NEAR-MISS AUDIO — plays once when the player narrowly avoids a pillar/ground.
const NEAR_MISS_AUDIO_URL = "assets/audio/near-miss.mp3";

// 4. PILLAR-CROSSED AUDIO — plays every time one pillar pair is passed successfully.
const PILLAR_CROSSED_AUDIO_URL = "assets/audio/pillar-crossed.mp3";

// 5. VICTORY AUDIO — plays after the player passes all 10 pillars.
const VICTORY_AUDIO_URL = "assets/audio/victory.mp3";

// 6. GAME-OVER AUDIO — plays when the player hits a pillar or the ground.
const GAME_OVER_AUDIO_URL = "assets/audio/game-over.mp3";

/* ---------- GAME SETTINGS ---------- */
const TOTAL_PILLARS_TO_WIN = 10;
const WORLD = { width: 800, height: 560, groundHeight: 58 };
const DIFFICULTY = {
  easy:   { speed: 2.55, gap: 190, gravity: 0.30, flap: -6.5 },
  medium: { speed: 3.15, gap: 166, gravity: 0.34, flap: -6.8 },
  hard:   { speed: 3.85, gap: 148, gravity: 0.38, flap: -7.1 }
};

const $ = (id) => document.getElementById(id);
const screens = ["introScreen", "profileScreen", "readyScreen", "gameScreen", "resultScreen"];
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
createAudio("nearMiss", NEAR_MISS_AUDIO_URL, false, 0.75);
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
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  playLoop("intro");
}

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
$("introStartBtn").addEventListener("click", () => {
  unlockAudio();
  // Let the intro theme play briefly before moving to profile selection.
  $("introStartBtn").disabled = true;
  $("introStartBtn").innerHTML = "GETTING READY…";
  setTimeout(() => {
    $("introStartBtn").disabled = false;
    $("introStartBtn").innerHTML = 'START YOUR JOURNEY <span>→</span>';
    openProfileScreen();
  }, 1100);
});
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
  state: "ready", score: 0, player: { x: 185, y: 250, vy: 0, radius: 22 },
  pillars: [], frame: 0, difficulty: DIFFICULTY.medium, nearMissArmed: true,
  particles: [], lastTime: 0
};

function resetGame() {
  game.score = 0;
  game.frame = 0;
  game.player = { x: 185, y: 250, vy: 0, radius: 22 };
  game.pillars = [];
  game.particles = [];
  game.nearMissArmed = true;
  for (let i = 0; i < 3; i++) {
    game.pillars.push(makePillar(WORLD.width + 100 + i * 285));
  }
  $("scoreText").textContent = `0 / ${TOTAL_PILLARS_TO_WIN}`;
  $("gameOverlay").classList.remove("show");
}
function makePillar(x) {
  const gap = game.difficulty.gap;
  const margin = 95;
  const top = margin + Math.random() * (WORLD.height - WORLD.groundHeight - gap - margin * 2);
  return { x, width: 76, gapY: top, gapH: gap, passed: false };
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
  if (game.pillars[game.pillars.length - 1].x < WORLD.width - 270) {
    game.pillars.push(makePillar(WORLD.width + 60));
  }
  game.pillars = game.pillars.filter(pipe => pipe.x + pipe.width > -10);
  isNearMiss();
  if (collided()) finishGame(false);
}
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  gradient.addColorStop(0, "#86d4e0"); gradient.addColorStop(1, "#d5f1d8");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  // Soft clouds
  ctx.fillStyle = "rgba(255,255,255,.55)";
  for (let i = 0; i < 5; i++) {
    const x = ((i * 205 - game.frame * .25) % (WORLD.width + 120) + WORLD.width + 120) % (WORLD.width + 120) - 60;
    const y = 75 + (i % 3) * 75;
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.arc(x + 24, y - 9, 29, 0, Math.PI * 2); ctx.arc(x + 52, y, 21, 0, Math.PI * 2); ctx.fill();
  }
  // Distant hills
  ctx.fillStyle = "#85cba8";
  ctx.beginPath(); ctx.moveTo(0, WORLD.height - WORLD.groundHeight);
  for (let x = 0; x <= WORLD.width; x += 20) ctx.lineTo(x, 405 + Math.sin((x + game.frame * .5) / 70) * 18);
  ctx.lineTo(WORLD.width, WORLD.height); ctx.lineTo(0, WORLD.height); ctx.fill();
}
function drawPillar(pipe) {
  const topH = pipe.gapY;
  const bottomY = pipe.gapY + pipe.gapH;
  const floorY = WORLD.height - WORLD.groundHeight;
  const drawTube = (x, y, w, h, isTop) => {
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, "#21785e"); grad.addColorStop(.25, "#42b98b"); grad.addColorStop(.7, "#2b956f"); grad.addColorStop(1, "#17634f");
    ctx.fillStyle = grad; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#83e0b3"; ctx.fillRect(x + 8, y, 7, h);
    ctx.fillStyle = "#17634f"; ctx.fillRect(x + w - 9, y, 6, h);
    const capY = isTop ? y + h - 20 : y;
    ctx.fillStyle = "#258a68"; ctx.fillRect(x - 7, capY, w + 14, 20);
    ctx.strokeStyle = "#a1efc9"; ctx.lineWidth = 2; ctx.strokeRect(x - 7, capY, w + 14, 20);
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
  ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.stroke();
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
  ctx.fillStyle = "#ffc45e"; ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.x + 7, p.y - 6, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#18213d"; ctx.beginPath(); ctx.arc(p.x + 10, p.y - 6, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f07848"; ctx.beginPath(); ctx.moveTo(p.x + 15, p.y + 2); ctx.lineTo(p.x + 28, p.y + 7); ctx.lineTo(p.x + 15, p.y + 11); ctx.fill();
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
function draw() {
  drawBackground();
  game.pillars.forEach(drawPillar);
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
canvas.addEventListener("pointerdown", handleFlapInput);
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

// Draw a still game preview behind the first frame, and use Medium by default.
game.difficulty = DIFFICULTY.medium;
resetGame();
draw();
