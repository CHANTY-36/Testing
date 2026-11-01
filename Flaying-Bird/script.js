/* ==========================================
   AURORA FLIGHT — GAME ENGINE
   ========================================== */

const $ = id => document.getElementById(id);

const DEFAULT_AVATAR = "https://raw.githubusercontent.com/CHANTY-36/Testing/refs/heads/main/Memes/1793545464179.png";

const AUDIO = {
    intro: "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/startcheyyibey_1.mp3",
    profile: "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/niranjan.mp3",
    gameplay: "assets/audio/gameplay-theme.mp3",
    near: "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/amma-jarunte.mp3",
    crossed: "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/sathireddy_1.mp3",
    victory: "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/sairamsairam.mp3",
    gameover: "https://github.com/CHANTY-36/Testing/raw/refs/heads/main/Memes/nagantalogame_1.mp3"
};

const TOTAL_PILLARS = 10;

const THEMES = [
    {name:"Aurora Skies",sky1:"#09263d",sky2:"#164c63",glow:"#75f4d5",pipe:"#3ad9b6",pipe2:"#168b87"},
    {name:"Sunset Ember",sky1:"#421c3e",sky2:"#bd593f",glow:"#ffd18c",pipe:"#ffb35c",pipe2:"#bd5a48"},
    {name:"Moonlit Lagoon",sky1:"#101e4d",sky2:"#245c83",glow:"#9edcff",pipe:"#65c7f2",pipe2:"#3475b5"},
    {name:"Jade Forest",sky1:"#0b382e",sky2:"#26745a",glow:"#b8f5a4",pipe:"#a2df7b",pipe2:"#39895a"},
    {name:"Golden Temple",sky1:"#402b17",sky2:"#a86d2d",glow:"#ffe49a",pipe:"#ffdb73",pipe2:"#b47a2b"},
    {name:"Violet Nebula",sky1:"#251747",sky2:"#653c91",glow:"#e3b7ff",pipe:"#c69cff",pipe2:"#7954b6"},
    {name:"Crystal Glacier",sky1:"#102d45",sky2:"#438aa2",glow:"#c7f5ff",pipe:"#8ce8ed",pipe2:"#3b9eb1"},
    {name:"Coral Horizon",sky1:"#4a243e",sky2:"#c56b69",glow:"#ffd2c1",pipe:"#ffb0a0",pipe2:"#bf6377"},
    {name:"Electric Dream",sky1:"#111b42",sky2:"#354c9b",glow:"#a9baff",pipe:"#8ba5ff",pipe2:"#4d5fc0"},
    {name:"Dawn of Victory",sky1:"#3d2440",sky2:"#b77d54",glow:"#fff0b8",pipe:"#ffe18a",pipe2:"#c18b4b"}
];

const LEVELS = {
    easy:   {speed:2.50, gap:240, gravity:.25, flap:-7.0},
    medium: {speed:3.00,gap:200, gravity:.30, flap:-7.4},
    hard:   {speed:3.50, gap:170, gravity:.35, flap:-7.8}
};

const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");

let selectedAvatar = DEFAULT_AVATAR;
let customPhoto = null;
let selectedProfile = "default";
let profileReady = false;

let muted = false;
let audioUnlocked = false;
let currentMusic = null;
let currentMusicName = "";
let activeSfx = null;
let sfxToken = 0;
let introPlayed = false;

const sounds = {};

Object.entries(AUDIO).forEach(([name, path]) => {
    const audio = new Audio(path);
    audio.preload = "auto";

    if (["intro", "profile", "gameplay"].includes(name)) {
        audio.loop = true;
    }

    sounds[name] = audio;
});


/* ==========================================
   AUDIO MANAGER
   One SFX channel only.
   Collision > Pillar Crossed > Near Miss.
   ========================================== */

function stopMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    currentMusic = null;
    currentMusicName = "";
}

function stopSfx() {
    if (activeSfx) {
        activeSfx.pause();
        activeSfx.currentTime = 0;
        activeSfx.onended = null;
        activeSfx = null;
    }

    sfxToken++;
}

function startMusic(name) {
    if (muted || !audioUnlocked) return;

    if (
        currentMusicName === name &&
        currentMusic &&
        !currentMusic.paused
    ) {
        return;
    }

    stopMusic();

    const audio = sounds[name];

    if (!audio) return;

    currentMusic = audio;
    currentMusicName = name;

    audio.loop = true;
    audio.volume = name === "profile" ? 0.35 : 0.23;
    audio.currentTime = 0;
    audio.muted = muted;

    audio.play().catch(() => {});
}

function playSfx(name) {
    if (muted) return;

    // Stop the previous sound before starting a new one.
    stopSfx();

    const audio = sounds[name];

    if (!audio) return;

    const thisToken = sfxToken;

    activeSfx = audio;
    audio.loop = false;
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.muted = muted;

    audio.onended = () => {
        if (thisToken === sfxToken && activeSfx === audio) {
            activeSfx = null;
        }
    };

    audio.play().catch(() => {
        if (thisToken === sfxToken) activeSfx = null;
    });
}

function unlockAudio() {
    if (audioUnlocked) return;

    audioUnlocked = true;

    if (muted) return;

    // Intro and profile music are played one after the other.
    const intro = sounds.intro;

    if (!introPlayed && intro) {
        introPlayed = true;

        stopMusic();

        currentMusic = intro;
        currentMusicName = "intro";

        intro.loop = false;
        intro.currentTime = 0;
        intro.volume = 0.3;

        intro.onended = () => {
            if ($("profileScreen").classList.contains("active")) {
                startMusic("profile");
            }
        };

        intro.play().catch(() => {
            startMusic("profile");
        });
    } else {
        startMusic("profile");
    }
}

function toggleMute() {
    muted = !muted;

    $("muteBtn").textContent = muted
        ? "🔇 Sound Off"
        : "🔊 Sound On";

    Object.values(sounds).forEach(audio => {
        audio.muted = muted;
    });

    if (muted) {
        stopMusic();
        stopSfx();
    } else if (audioUnlocked) {
        if (game.running) {
            startMusic("gameplay");
        } else if ($("profileScreen").classList.contains("active")) {
            startMusic("profile");
        }
    }
}

$("muteBtn").addEventListener("click", event => {
    event.stopPropagation();
    unlockAudio();
    toggleMute();
});


/* ==========================================
   SCREEN MANAGEMENT
   ========================================== */

const screenIds = [
    "profileScreen",
    "readyScreen",
    "gameScreen",
    "resultScreen"
];

function showScreen(id) {
    screenIds.forEach(screen => {
        $(screen).classList.toggle("active", screen === id);
    });

    if (id === "profileScreen") {
        startMusic("profile");
    } else {
        stopMusic();
    }
}


/* ==========================================
   PROFILE SELECTION
   ========================================== */

$("defaultPreviewImg").src = DEFAULT_AVATAR;

function selectProfile(type) {
    selectedProfile = type;

    $("customProfileBtn").classList.toggle(
        "selected",
        type === "custom"
    );

    $("defaultProfileBtn").classList.toggle(
        "selected",
        type === "default"
    );

    if (type === "default") {
        selectedAvatar = DEFAULT_AVATAR;
        profileReady = true;
        $("profileHint").textContent =
            "Default game profile selected.";
    }

    if (type === "custom" && customPhoto) {
        selectedAvatar = customPhoto;
        profileReady = true;
        $("profileHint").textContent =
            "Your photo is ready.";
    }

    if (type === "custom" && !customPhoto) {
        profileReady = false;
        $("profileHint").textContent =
            "Choose a photo from your device.";

        $("photoInput").click();
    }

    $("profileContinueBtn").disabled = !profileReady;
}

$("defaultProfileBtn").addEventListener("click", () => {
    unlockAudio();
    selectProfile("default");
});

$("customProfileBtn").addEventListener("click", () => {
    unlockAudio();
    selectProfile("custom");
});

$("photoInput").addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        $("profileHint").textContent =
            "Please select an image file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        customPhoto = reader.result;
        selectedAvatar = customPhoto;
        selectedProfile = "custom";
        profileReady = true;

        $("customPreview").innerHTML =
            `<img src="${customPhoto}" alt="Custom profile">`;

        $("customProfileBtn").classList.add("selected");
        $("defaultProfileBtn").classList.remove("selected");

        $("profileHint").textContent = "Your photo is ready.";
        $("profileContinueBtn").disabled = false;
    };

    reader.readAsDataURL(file);
});

$("profileContinueBtn").addEventListener("click", () => {
    if (!profileReady) return;

    $("readyAvatar").src = selectedAvatar;
    showScreen("readyScreen");
});

document.querySelectorAll(".back-btn").forEach(button => {
    button.addEventListener("click", () => {
        showScreen(button.dataset.back);
    });
});


/* ==========================================
   GAME STATE
   ========================================== */

const game = {
    running: false,
    paused: false,
    over: false,

    score: 0,
    frame: 0,

    player: {
        x: 175,
        y: 340,
        vy: 0,
        radius: 30
    },

    pillars: [],
    particles: [],

    difficulty: "medium",
    nearArmed: true,
    nearCooldown: 0,
    lastTime: 0
};

let avatarImage = new Image();
avatarImage.src = DEFAULT_AVATAR;

function syncAvatar() {
    avatarImage = new Image();
    avatarImage.src = selectedAvatar;
}

function resetGame() {
    game.score = 0;
    game.frame = 0;
    game.pillars = [];
    game.particles = [];

    game.nearArmed = true;
    game.nearCooldown = 0;

    game.player = {
        x: 175,
        y: 340,
        vy: 0,
        radius: 30
    };

    for (let i = 0; i < 3; i++) {
        spawnPillar(850 + i * 300);
    }

    $("scoreText").textContent = "0 / 10";
    $("stageName").textContent = THEMES[0].name;
}


/* ==========================================
   START / REPLAY
   ========================================== */

function startGame() {
    unlockAudio();

    stopSfx();
    stopMusic();

    game.difficulty = $("difficultySelect").value;

    resetGame();

    game.running = true;
    game.paused = false;
    game.over = false;

    $("gameOverlay").classList.remove("show");
    $("pauseBtn").textContent = "Ⅱ Pause";

    syncAvatar();

    showScreen("gameScreen");

    startMusic("gameplay");

    game.lastTime = 0;

    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(gameLoop);
}

let animationFrame = 0;

$("gameStartBtn").addEventListener("click", startGame);

// Important: replay immediately starts the game using the same profile.
$("replayBtn").addEventListener("click", startGame);

$("changeProfileBtn").addEventListener("click", () => {
    profileReady = false;
    selectedProfile = null;

    $("profileContinueBtn").disabled = true;

    $("customProfileBtn").classList.remove("selected");
    $("defaultProfileBtn").classList.remove("selected");

    showScreen("profileScreen");
});


/* ==========================================
   PILLAR CREATION
   ========================================== */

function spawnPillar(x) {
    const difficulty = LEVELS[game.difficulty];
    const gap = difficulty.gap;

    const margin = 110;

    const center =
        margin + Math.random() * (700 - 54 - gap - margin * 2);

    const number = game.pillars.length + game.score + 1;

    game.pillars.push({
        x: x,
        width: 82,
        gap: gap,
        center: center,
        top: center - gap / 2,
        bottom: center + gap / 2,
        passed: false,
        number: number,
        golden: number === 5,
        phase: Math.random() * 6.28
    });
}


/* ==========================================
   FLAP / PAUSE
   ========================================== */

function flap() {
    if (!game.running || game.paused || game.over) return;

    game.player.vy = LEVELS[game.difficulty].flap;

    game.nearArmed = true;
}

function pauseGame() {
    if (!game.running || game.over) return;

    game.paused = !game.paused;

    $("gameOverlay").classList.toggle("show", game.paused);

    $("pauseBtn").textContent =
        game.paused ? "▶ Resume" : "Ⅱ Pause";

    if (game.paused) {
        stopMusic();
    } else {
        startMusic("gameplay");

        game.lastTime = 0;
        animationFrame = requestAnimationFrame(gameLoop);
    }
}

$("pauseBtn").addEventListener("click", event => {
    event.stopPropagation();
    pauseGame();
});

$("resumeBtn").addEventListener("click", event => {
    event.stopPropagation();
    pauseGame();
});


/* ==========================================
   INPUT CONTROLS
   ========================================== */

$("gameScreen").addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    if (game.paused) return;

    flap();
});

document.addEventListener("keydown", event => {
    if (
        ["Space", "ArrowUp", "KeyW"].includes(event.code) &&
        $("gameScreen").classList.contains("active")
    ) {
        event.preventDefault();
        flap();
    }

    if (
        event.code === "Escape" &&
        $("gameScreen").classList.contains("active")
    ) {
        pauseGame();
    }
});

document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });


/* ==========================================
   COLLISION DETECTION
   ========================================== */

function isColliding() {
    const p = game.player;
    const floor = 700 - 24;

    if (
        p.y - p.radius <= 0 ||
        p.y + p.radius >= floor
    ) {
        return true;
    }

    for (const pipe of game.pillars) {
        const overlapX =
            p.x + p.radius > pipe.x &&
            p.x - p.radius < pipe.x + pipe.width;

        const hitTop = p.y - p.radius < pipe.top;
        const hitBottom = p.y + p.radius > pipe.bottom;

        if (overlapX && (hitTop || hitBottom)) {
            return true;
        }
    }

    return false;
}


/* ==========================================
   NEAR-MISS DETECTION
   ========================================== */

function detectNearMiss() {
    if (!game.nearArmed || game.nearCooldown > 0) {
        return false;
    }

    const p = game.player;
    const floor = 700 - 24;

    const nearGround =
        floor - (p.y + p.radius) < 18 &&
        p.y + p.radius < floor;

    let nearPillar = false;

    for (const pipe of game.pillars) {
        const closeX =
            p.x + p.radius > pipe.x - 15 &&
            p.x - p.radius < pipe.x + pipe.width + 15;

        if (!closeX) continue;

        const topDistance =
            (p.y - p.radius) - pipe.top;

        const bottomDistance =
            pipe.bottom - (p.y + p.radius);

        if (
            (topDistance >= 0 && topDistance < 16) ||
            (bottomDistance >= 0 && bottomDistance < 16)
        ) {
            nearPillar = true;
            break;
        }
    }

    if (nearGround || nearPillar) {
        game.nearArmed = false;
        game.nearCooldown = 30;

        return true;
    }

    return false;
}


/* ==========================================
   UPDATE GAME
   ========================================== */

function updateGame(dt) {
    const p = game.player;
    const settings = LEVELS[game.difficulty];

    game.nearCooldown = Math.max(
        0,
        game.nearCooldown - dt
    );

    p.vy += settings.gravity * dt;
    p.y += p.vy * dt;

    let pillarCrossedThisFrame = false;

    // Move pillars and apply subtle movement.
    for (const pipe of game.pillars) {
        pipe.x -= settings.speed * dt;

        pipe.phase += 0.018 * dt;

        const movement =
            game.difficulty === "easy" ? 0 :
            game.difficulty === "medium" ? 10 : 18;

        const center =
            pipe.center + Math.sin(pipe.phase) * movement;

        pipe.top = center - pipe.gap / 2;
        pipe.bottom = center + pipe.gap / 2;
    }

    // Collision has the highest priority.
    if (isColliding()) {
        finishGame(false);
        return;
    }

    // Detect successful pillar crossing.
    for (const pipe of game.pillars) {
        if (
            !pipe.passed &&
            pipe.x + pipe.width < p.x - p.radius
        ) {
            pipe.passed = true;

            game.score++;

            pillarCrossedThisFrame = true;

            $("scoreText").textContent =
                `${game.score} / ${TOTAL_PILLARS}`;

            // Switch theme after each passed pillar.
            const themeIndex = Math.min(
                game.score,
                THEMES.length - 1
            );

            $("stageName").textContent =
                THEMES[themeIndex].name;
        }
    }

    // Pillar-crossed audio suppresses near-miss audio for this frame.
    if (pillarCrossedThisFrame) {
        game.nearArmed = false;
        game.nearCooldown = 30;

        playSfx("crossed");
    } else {
        if (detectNearMiss()) {
            playSfx("near");
        }
    }

    // Ten pillars only. No eleventh obstacle.
    if (game.score >= TOTAL_PILLARS) {
        finishGame(true);
        return;
    }

    // Create next pillar only until the tenth one.
    const lastPillar =
        game.pillars[game.pillars.length - 1];

    if (
        game.score + game.pillars.length < TOTAL_PILLARS &&
        lastPillar &&
        lastPillar.x < 800 - 270
    ) {
        spawnPillar(860);
    }

    game.pillars = game.pillars.filter(
        pipe => pipe.x + pipe.width > -10
    );

    if (
        game.nearCooldown <= 0 &&
        p.y + p.radius < 700 - 24 - 45
    ) {
        game.nearArmed = true;
    }
}


/* ==========================================
   END GAME
   ========================================== */

function finishGame(won) {
    if (game.over) return;

    game.over = true;
    game.running = false;
    game.paused = false;

    stopMusic();
    stopSfx();

    // Only the final event sound is played.
    playSfx(won ? "victory" : "gameover");

    $("resultIcon").textContent = won ? "🏆" : "💫";

    $("resultEyebrow").textContent =
        won ? "FLIGHT COMPLETE" : "FLIGHT ENDED";

    $("resultTitle").innerHTML =
        won ? 'YOU <span>WIN!</span>' : 'NICE <span>TRY!</span>';

    $("resultMessage").textContent =
        won
            ? "Incredible! You crossed all 10 pillars and explored every world."
            : "That was a close flight! Try again and beat your score.";

    $("finalScore").textContent =
        `${game.score} / ${TOTAL_PILLARS}`;

    $("winnerAvatar").src = selectedAvatar;

    $("gameOverlay").classList.remove("show");

    showScreen("resultScreen");

    if (won) {
        celebrate();
    }
}


/* ==========================================
   VICTORY CELEBRATION
   ========================================== */

function celebrate() {
    const layer = $("celebrationLayer");

    layer.innerHTML = "";

    for (let i = 0; i < 55; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti";

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.animationDelay =
            Math.random() * .8 + "s";

        piece.style.background = [
            "#66f0d0",
            "#9b8cff",
            "#ffd17d",
            "#ffffff"
        ][i % 4];

        layer.appendChild(piece);
    }
}


/* ==========================================
   DRAW BACKGROUND
   ========================================== */

function drawBackground() {
    const theme =
        THEMES[Math.min(game.score, THEMES.length - 1)];

    const gradient =
        ctx.createLinearGradient(0, 0, 0, 700);

    gradient.addColorStop(0, theme.sky1);
    gradient.addColorStop(1, theme.sky2);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 700);

    // Aurora glow bands.
    for (let i = 0; i < 4; i++) {
        ctx.globalAlpha = .09;
        ctx.fillStyle = theme.glow;

        ctx.beginPath();

        ctx.ellipse(
            140 + i * 220 + Math.sin(game.frame * .006 + i) * 40,
            140 + i * 80,
            180,
            55,
            .2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Stars.
    for (let i = 0; i < 45; i++) {
        const x = (i * 137 + game.frame * .15) % 800;
        const y = (i * 83) % 650;

        ctx.fillStyle = theme.glow;
