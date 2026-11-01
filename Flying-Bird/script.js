(() => {
"use strict";
const $ = id => document.getElementById(id);
const screens = ["profileScreen","readyScreen","gameScreen","resultScreen"];
let selectedProfile = null, selectedAvatar = "assets/default-character.svg", customPhoto = null;
let soundOn = true, audioCtx = null, running = false, paused = false, raf = 0;
let bird, pillars = [], pillarsCreated = 0, score = 0, lastTime = 0, spawnTimer = 0;
let difficulty = "medium", gameOver = false;
const TOTAL = 10, W = 720, H = 900, GAP = 260, themes = [
  ["#07384a","#20e5c3","#d4fff8"],["#30245b","#a88bff","#f5dcff"],
  ["#4a263e","#ff9bba","#ffe4b5"],["#173c35","#a5ed9b","#f0ffd0"],
  ["#46351b","#ffd166","#fff0b0"],["#18385e","#70b7ff","#d9f0ff"],
  ["#4b2858","#ed9cff","#ffe2ff"],["#164b51","#5ff0d0","#dffff7"],
  ["#503326","#ffb36b","#fff0d9"],["#252b55","#b5c5ff","#f4f6ff"]
];
const canvas=$("gameCanvas"), ctx=canvas.getContext("2d");

function showScreen(id){screens.forEach(s=>$(s).classList.toggle("active",s===id));}
function setHint(t){$("profileHint").textContent=t;}
function ensureAudio(){if(!audioCtx){const A=window.AudioContext||window.webkitAudioContext;if(A)audioCtx=new A();}if(audioCtx?.state==="suspended")audioCtx.resume();}
function tone(freq=440,duration=.12,type="sine",volume=.045){if(!soundOn)return;ensureAudio();if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}
function sfx(kind){if(kind==="hit"){tone(110,.4,"sawtooth",.08);setTimeout(()=>tone(65,.35,"triangle",.06),90);}else if(kind==="pass"){tone(660,.1);setTimeout(()=>tone(880,.12),75);}else if(kind==="near"){tone(260,.16,"triangle",.035);}else if(kind==="win"){[523,659,784,1046].forEach((n,i)=>setTimeout(()=>tone(n,.22),i*130));}else{tone(150,.3,"sawtooth",.06);}}
function updateSoundLabel(){$("soundToggle").textContent=soundOn?"🔊 Sound On":"🔇 Sound Off";}
$("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;updateSoundLabel();if(soundOn)ensureAudio();});

function chooseProfile(type){
  selectedProfile=type;
  $("customProfileBtn").classList.toggle("selected",type==="custom");
  $("defaultProfileBtn").classList.toggle("selected",type==="default");
  $("customProfileBtn").setAttribute("aria-pressed",String(type==="custom"));
  $("defaultProfileBtn").setAttribute("aria-pressed",String(type==="default"));
  if(type==="default"){selectedAvatar="assets/default-character.svg";$("profileContinueBtn").disabled=false;setHint("Game Profile selected. You can continue.");}
  else if(customPhoto){selectedAvatar=customPhoto;$("profileContinueBtn").disabled=false;setHint("Your photo is ready.");}
  else{$("profileContinueBtn").disabled=true;setHint("Choose a photo from your device.");$("photoInput").click();}
}
$("customProfileBtn").addEventListener("click",()=>chooseProfile("custom"));
$("defaultProfileBtn").addEventListener("click",()=>chooseProfile("default"));
$("photoInput").addEventListener("change",e=>{
 const file=e.target.files&&e.target.files[0];if(!file)return;
 if(!file.type.startsWith("image/")){setHint("Please choose an image file.");return;}
 const reader=new FileReader();reader.onload=()=>{customPhoto=reader.result;selectedAvatar=customPhoto;selectedProfile="custom";$("customPreview").innerHTML=`<img alt="Your photo" src="${customPhoto}">`;$("customProfileBtn").classList.add("selected");$("defaultProfileBtn").classList.remove("selected");$("customProfileBtn").setAttribute("aria-pressed","true");$("defaultProfileBtn").setAttribute("aria-pressed","false");$("profileContinueBtn").disabled=false;setHint("Your photo is ready. Tap Continue.");};reader.readAsDataURL(file);
});
$("profileContinueBtn").addEventListener("click",()=>{if(!selectedProfile||$("profileContinueBtn").disabled)return;$("readyAvatar").src=selectedAvatar;showScreen("readyScreen");});
$("backToProfileBtn").addEventListener("click",()=>showScreen("profileScreen"));
$("changeProfileBtn").addEventListener("click",()=>{stopGame();showScreen("profileScreen");});
$("flyBtn").addEventListener("click",()=>startGame());
$("tryAgainBtn").addEventListener("click",()=>startGame());
$("pauseBtn").addEventListener("click",pauseGame);
$("resumeBtn").addEventListener("click",resumeGame);

function startGame(){
 ensureAudio();difficulty=$("difficulty").value;score=0;pillarsCreated=0;pillars=[];gameOver=false;paused=false;running=true;
 const speeds={easy:205,medium:250,hard:295};bird={x:180,y:440,vy:0,r:29};spawnTimer=0;lastTime=0;
 $("score").textContent="0";$("pauseOverlay").classList.add("hidden");$("resultAvatar").src=selectedAvatar;
 showScreen("gameScreen");cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
function stopGame(){running=false;paused=false;cancelAnimationFrame(raf);}
function pauseGame(){if(!running||gameOver)return;paused=true;$("pauseOverlay").classList.remove("hidden");}
function resumeGame(){if(!running||gameOver)return;paused=false;$("pauseOverlay").classList.add("hidden");lastTime=0;raf=requestAnimationFrame(loop);}
function flap(){if(!running||paused||gameOver)return;bird.vy=-480;tone(420,.06,"sine",.025);}
function addPillar(){if(pillarsCreated>=TOTAL)return;const gap=GAP+(difficulty==="easy"?35:difficulty==="hard"?-35:0);const min=170,max=H-170-gap;const center=min+Math.random()*(max-min);pillars.push({x:W+35,center,gap,passed:false,n:pillarsCreated+1});pillarsCreated++;}
function finish(win){if(gameOver)return;gameOver=true;running=false;cancelAnimationFrame(raf);if(win){sfx("win");$("resultIcon").textContent="🏆";$("resultEyebrow").textContent="FLIGHT COMPLETE";$("resultTitle").textContent="YOU WIN!";$("resultMessage").textContent="Amazing flight! You crossed all 10 pillars.";}else{sfx("hit");$("resultIcon").textContent="💫";$("resultEyebrow").textContent="FLIGHT OVER";$("resultTitle").textContent="TRY AGAIN!";$("resultMessage").textContent="Every flight makes you stronger. Give it another try!";}$("finalScore").textContent=`${score} / ${TOTAL}`;$("resultAvatar").src=selectedAvatar;showScreen("resultScreen");}
function loop(t){if(!running||paused)return;if(!lastTime)lastTime=t;const dt=Math.min((t-lastTime)/1000,.035);lastTime=t;update(dt);draw();if(running)raf=requestAnimationFrame(loop);}
function update(dt){
 const speed={easy:205,medium:250,hard:295}[difficulty];bird.vy+=1050*dt;bird.y+=bird.vy*dt;
 spawnTimer+=dt;if(spawnTimer>1.55&&pillarsCreated<TOTAL){addPillar();spawnTimer=0;}
 for(const p of pillars){p.x-=speed*dt;
   if(!p.passed&&p.x+78<bird.x){p.passed=true;score++;$("score").textContent=score;sfx("pass");if(score===TOTAL){finish(true);return;}}
   if(bird.x+bird.r>p.x&&bird.x-bird.r<p.x+78&&(bird.y-bird.r<p.center-p.gap/2||bird.y+bird.r>p.center+p.gap/2)){finish(false);return;}
 }
 pillars=pillars.filter(p=>p.x>-100);
 if(bird.y-bird.r<0||bird.y+bird.r>H){finish(false);return;}
}
function draw(){
 const theme=themes[Math.min(Math.max(score,0),9)];const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,theme[0]);grad.addColorStop(1,"#041725");ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 // distant stars
 for(let i=0;i<42;i++){const x=(i*137+score*23)%W,y=(i*83)%H;ctx.fillStyle="rgba(220,255,255,.45)";ctx.beginPath();ctx.arc(x,y,(i%3)+1,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle="rgba(255,255,255,.09)";ctx.font="bold 24px system-ui";ctx.fillText(`WORLD ${Math.min(score+1,10)}`,28,48);
 for(const p of pillars){const top=p.center-p.gap/2,bottom=p.center+p.gap/2;const gold=p.n===5;const col=gold?"#ffd166":theme[1];ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=gold?22:9;ctx.fillRect(p.x,0,78,top);ctx.fillRect(p.x,bottom,78,H-bottom);ctx.shadowBlur=0;ctx.fillStyle="rgba(0,0,0,.16)";ctx.fillRect(p.x+12,0,9,top);ctx.fillRect(p.x+12,bottom,9,H-bottom);ctx.fillStyle=gold?"#fff0b0":theme[2];ctx.fillRect(p.x-8,top-15,94,15);ctx.fillRect(p.x-8,bottom,94,15);}
 // flyer
 ctx.save();ctx.translate(bird.x,bird.y);ctx.rotate(Math.max(-.45,Math.min(.55,bird.vy/850)));ctx.fillStyle="#fff";ctx.shadowColor=theme[1];ctx.shadowBlur=18;ctx.beginPath();ctx.arc(0,0,bird.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=theme[1];ctx.beginPath();ctx.ellipse(-7,7,15,9,-.35,0,Math.PI*2);ctx.fill();ctx.fillStyle="#102b3a";ctx.beginPath();ctx.arc(10,-8,4,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffb45e";ctx.beginPath();ctx.moveTo(24,0);ctx.lineTo(43,7);ctx.lineTo(24,12);ctx.closePath();ctx.fill();ctx.restore();
}
function gameInput(e){if(e.target.closest("button"))return;if(!running||paused)return;e.preventDefault();flap();}
canvas.addEventListener("pointerdown",gameInput,{passive:false});
window.addEventListener("keydown",e=>{if(e.code==="Space"){if($("gameScreen").classList.contains("active")){e.preventDefault();flap();}}if(e.code==="Escape"&&running){paused?resumeGame():pauseGame();}});
updateSoundLabel();
})();