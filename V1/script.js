const stage = document.getElementById("stage");
const progressFill = document.getElementById("progressFill");
const fx = document.getElementById("fx");
const ctx = fx.getContext("2d");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

// Demo photos only — replace these URLs with Chanty's real photos later.
const photos = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Birthday_Balloons.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Happy_balloons.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Classroom_with_pople.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Students_in_a_classroom.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Classroom_in_India.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Birthday_decoration.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Happy_birthday_with_balloons_in_different_colors.jpg"
];

let step = 0, musicStarted = false, particles = [];
const totalSteps = 10;

function resize(){fx.width=innerWidth*devicePixelRatio;fx.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener("resize",resize); resize();

function updateProgress(){progressFill.style.width = Math.min(100,(step/(totalSteps-1))*100)+"%"}

function bubbles(){
  document.querySelectorAll(".bubble").forEach(x=>x.remove());
  for(let i=0;i<18;i++){
    const b=document.createElement("i"); b.className="bubble";
    const s=8+Math.random()*35;
    b.style.width=b.style.height=s+"px";
    b.style.left=Math.random()*100+"%";
    b.style.animationDuration=(6+Math.random()*10)+"s";
    b.style.animationDelay=(-Math.random()*10)+"s";
    stage.appendChild(b);
  }
}
function scene(html){
  stage.innerHTML=`<div class="scene">${html}</div>`;
  bubbles(); updateProgress();
}
function startMusic(){
  if(musicStarted)return;
  musicStarted=true;
  music.volume=.6;
  music.play().catch(()=>{});
  musicBtn.textContent="🔊";
}
musicBtn.onclick=()=>{
  if(music.paused){music.play().catch(()=>{});musicBtn.textContent="🔊"}
  else{music.pause();musicBtn.textContent="🔇"}
};
document.addEventListener("pointerdown",startMusic,{once:true});

function burst(x=innerWidth/2,y=innerHeight/2,count=90){
  for(let i=0;i<count;i++){
    particles.push({x,y,vx:(Math.random()-.5)*12,vy:(Math.random()-.8)*12,g:.18,
      life:70+Math.random()*50,size:2+Math.random()*5,
      char:["✦","•","❤","✧","●"][Math.floor(Math.random()*5)]});
  }
}
function animateFX(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;
    ctx.globalAlpha=Math.max(0,p.life/100);ctx.font=`${p.size*3}px sans-serif`;
    ctx.fillText(p.char,p.x,p.y);
  }); ctx.globalAlpha=1;
  requestAnimationFrame(animateFX);
}
animateFX();

function next(n=1){step=Math.min(totalSteps-1,step+n);render()}

function render(){
  if(step===0) return mystery();
  if(step===1) return tap();
  if(step===2) return discover();
  if(step===3) return gift();
  if(step===4) return memories(0);
  if(step===5) return quiz();
  if(step===6) return countdown();
  if(step===7) return explosion();
  if(step===8) return message();
  if(step===9) return finalSurprise();
}

function mystery(){
  scene(`
    <div class="kicker">A tiny birthday adventure</div>
    <h1 class="title neon">Hey, Chanty…</h1>
    <p class="subtitle">Today is <b>not</b> going to be a normal birthday wish.</p>
    <p class="small">Something has been secretly prepared for you.</p>
    <button class="cta dont" id="dont">DON'T TAP THIS 👀</button>
  `);
  document.getElementById("dont").onclick=()=>{burst();scene(`<h1 class="title">I KNEW IT 😂</h1><p class="subtitle">You really weren't supposed to tap that.</p><button class="cta" id="go">Okay… continue</button>`);document.getElementById("go").onclick=()=>next()};
}
function tap(){
  let hits=0;
  scene(`<div class="kicker">Mission 01</div><h2 class="title">Catch it.</h2><p class="subtitle">Tap the glowing thing <b>5 times</b>.</p><div class="tap-orb" id="orb">✨</div><p class="small" id="hits">0 / 5</p>`);
  const orb=document.getElementById("orb"), label=document.getElementById("hits");
  orb.onclick=()=>{
    hits++; burst(innerWidth/2,innerHeight/2,18); label.textContent=`${hits} / 5`;
    if(hits<5){
      orb.style.transform=`translate(${(Math.random()-.5)*100}px, ${(Math.random()-.5)*120}px) scale(.8)`;
      setTimeout(()=>orb.style.transform="",100);
    } else {
      burst(); setTimeout(()=>next(),500);
    }
  };
}
function discover(){
  const icons=["🎈","⭐","🎁","🔑","💌","🌙"];
  scene(`<div class="kicker">Mission 02</div><h2 class="title">Find the secret.</h2><p class="subtitle">One of these is hiding the next clue.</p><div class="mystery-grid">${icons.map((x,i)=>`<button class="mystery-item" data-i="${i}">${x}</button>`).join("")}</div><p class="small" id="hint">Choose wisely… 👀</p>`);
  const correct=3;
  document.querySelectorAll(".mystery-item").forEach(b=>b.onclick=()=>{
    if(+b.dataset.i===correct){burst();document.getElementById("hint").textContent="🔓 You found it!";setTimeout(()=>next(),650)}
    else{b.classList.add("shake");document.getElementById("hint").textContent="Nope 😂 Try again.";setTimeout(()=>b.classList.remove("shake"),400)}
  });
}
function gift(){
  scene(`<div class="kicker">Mission 03</div><h2 class="title">A suspicious gift…</h2><p class="subtitle">Tap it. Once. Then again. Then maybe again. 😌</p><div class="gift" id="gift"><div class="lid"></div><div class="box"></div></div><p class="small" id="giftText">It looks harmless…</p>`);
  let taps=0; const g=document.getElementById("gift"),t=document.getElementById("giftText");
  g.onclick=()=>{
    taps++;g.classList.add("shake");setTimeout(()=>g.classList.remove("shake"),350);
    if(taps===1)t.textContent="Hmm… nothing yet.";
    if(taps===2)t.textContent="Okay, it's definitely suspicious.";
    if(taps>=3){burst();t.textContent="💥 SURPRISE!";setTimeout(()=>next(),650)}
  };
}
function memories(i){
  const notes=[
    "Every good journey starts with a little curiosity.",
    "Some places become special because of the people beside us.",
    "Then there are the completely random moments…",
    "Classmates today, memories tomorrow.",
    "Some laughs only make sense to the people who were there.",
    "More journeys. More stories. More chaos. 😄",
    "And seven little snapshots of a much bigger story."
  ];
  scene(`<div class="kicker">Memory ${i+1} of 7</div><div class="journey">${i%2?"🚗":"✈️"}</div><div class="photo-wrap"><img src="${photos[i]}" onerror="this.style.background='linear-gradient(135deg,#ff4fa3,#754cff)';this.alt='Add ${photos[i]} here'"></div><p class="photo-note">${notes[i]}</p><button class="cta" id="memBtn">${i===6?"Continue":"Next memory →"}</button>`);
  document.getElementById("memBtn").onclick=()=>i===6?next():memories(i+1);
}
function quiz(){
  scene(`<div class="kicker">Mission 04</div><h2 class="title">One final test.</h2><p class="subtitle">How old is Chanty?</p><div class="quiz">${[18,19,20,21].map(x=>`<button data-age="${x}">${x}</button>`).join("")}</div><p class="small" id="quizText">Choose carefully. This is VERY important. 😌</p>`);
  document.querySelectorAll(".quiz button").forEach(b=>b.onclick=()=>{
    if(b.dataset.age==="20"){burst();document.getElementById("quizText").textContent="🎯 CORRECT! You may proceed.";setTimeout(()=>next(),700)}
    else{b.classList.add("shake");document.getElementById("quizText").textContent="Seriously? 😂 Try again.";setTimeout(()=>b.classList.remove("shake"),400)}
  });
}
function countdown(){
  let n=3;
  const go=()=>{scene(`<div class="kicker">Wait for it…</div><div class="count">${n}</div><p class="subtitle">${n===3?"Something big is coming.":n===2?"The moment is almost here…":"GET READY! 🎉"}</p>`);if(n>1){n--;setTimeout(go,1000)}else setTimeout(()=>next(),1100)};
  go();
}
function explosion(){
  scene(`<div class="birthday"><div class="kicker">The secret is out</div><h1 class="title neon">HAPPY<br>BIRTHDAY</h1><h2 class="title glow">CHANTY ❤️</h2><p class="subtitle"><b>20</b> looks good on you. 🥳</p><button class="cta" id="after">There's more… 👀</button></div>`);
  for(let i=0;i<8;i++)setTimeout(()=>burst(Math.random()*innerWidth,Math.random()*innerHeight,100),i*180);
  document.getElementById("after").onclick=()=>next();
}
function typeMessage(text,el){
  let i=0; el.innerHTML='<span class="cursor"></span>';
  const tick=()=>{if(i<text.length){el.innerHTML=text.slice(0,++i)+'<span class="cursor"></span>';setTimeout(tick,18)}else el.innerHTML=text};
  tick();
}
function message(){
  const text=`Hey Chanty,

20 isn't just another number. It's another chapter filled with new places, new memories, new adventures and plenty of moments that will someday become stories we laugh about.

From travelling together to all those classroom moments, some of the best memories are simply the ones we never planned.

So here's to more journeys, more laughs, more crazy moments and many more memories waiting to happen.

Keep smiling. Keep being you. ❤️

Happy 20th Birthday, Chanty! 🎂`;
  scene(`<div class="kicker">A message, just for you</div><h2 class="title">Dear Chanty…</h2><div class="message" id="msg"></div><button class="cta" id="final" style="margin-top:12px">Wait… there's one last thing 👀</button>`);
  typeMessage(text,document.getElementById("msg"));
  document.getElementById("final").onclick=()=>next();
}
function finalSurprise(){
  scene(`<div class="kicker">One last thing…</div><div class="final-photo"><img src="${photos[6]}" alt="Final memory"></div><h2 class="title neon">CHAPTER 20</h2><p class="subtitle">is officially open. ✨</p><p class="small">More journeys. More memories. More reasons to smile.</p><button class="cta" id="restart">Replay the adventure ↻</button>`);
  burst();setTimeout(()=>burst(innerWidth/2,innerHeight/2,150),500);
  document.getElementById("restart").onclick=()=>{step=0;render()};
}
render();
