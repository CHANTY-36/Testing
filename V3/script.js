const S = document.getElementById('stage');
const bar = document.getElementById('bar');
const music = document.getElementById('music');
const mb = document.getElementById('musicBtn');

let step = 0;
let mem = 0;
let audio;

/* =========================
   PHOTOS
========================= */

const photos = [
  'https://picsum.photos/seed/chantytravel1/900/1100',
  'https://picsum.photos/seed/chantytravel2/900/1100',
  'https://picsum.photos/seed/chantyfriends3/900/1100',
  'https://picsum.photos/seed/chantyclass4/900/1100',
  'https://picsum.photos/seed/chantyclass5/900/1100',
  'https://picsum.photos/seed/chantytravel6/900/1100',
  'https://picsum.photos/seed/chantyfinal7/900/1100'
];

const caps = [
  'A journey begins',
  'Somewhere on the way',
  'The people make it special',
  'Classroom chaos',
  'The laughs between lessons',
  'Another road, another memory',
  'And one more chapter'
];


/* =========================
   SOUND ENGINE
========================= */

function snd(
  freq = 440,
  duration = .14,
  type = 'sine'
) {

  try {

    audio ??=
      new (window.AudioContext ||
      window.webkitAudioContext)();

    const o = audio.createOscillator();
    const g = audio.createGain();

    o.type = type;

    o.frequency.setValueAtTime(
      freq,
      audio.currentTime
    );

    g.gain.setValueAtTime(
      .0001,
      audio.currentTime
    );

    g.gain.exponentialRampToValueAtTime(
      .10,
      audio.currentTime + .015
    );

    g.gain.exponentialRampToValueAtTime(
      .0001,
      audio.currentTime + duration
    );

    o.connect(g);
    g.connect(audio.destination);

    o.start();

    o.stop(
      audio.currentTime +
      duration +
      .02
    );

  } catch (e) {}

}


/* Special explosion sound */

function burstSound() {

  snd(
    180,
    .18,
    'sawtooth'
  );

  setTimeout(
    () => snd(
      520,
      .12,
      'triangle'
    ),
    70
  );

  setTimeout(
    () => snd(
      920,
      .16,
      'sine'
    ),
    140
  );

}


/* =========================
   BACKGROUND MUSIC
========================= */

function startMusic() {

  music
    .play()
    .then(() => {
      mb.textContent = '🔊';
    })
    .catch(() => {});

}

mb.onclick = () => {

  music.paused
    ? startMusic()
    : (
        music.pause(),
        mb.textContent = '🔇'
      );

};


/* =========================
   NAVIGATION
========================= */

function next() {

  step++;

  render();

}


function render() {

  bar.style.width =
    (step / 9 * 100) + '%';

  const pages = {

    0: mystery,
    1: doors,
    2: orb,
    3: gift,
    4: memories,
    5: challenge,
    6: quiz,
    7: countdown,
    8: message,
    9: finale

  };

  pages[step]();

}


/* =========================
   1. MYSTERY
========================= */

function mystery() {

  S.innerHTML = `
    <section class="scene">

      <div class="k">
        classified birthday file • C20
      </div>

      <h1>
        Hey Chanty…
      </h1>

      <p class="sub">
        Today is not going to be a normal birthday wish.
      </p>

      <button class="btn" id="a">
        DON'T TAP THIS 👀
      </button>

    </section>
  `;

  a.onclick = () => {

    snd(
      720,
      .18,
      'triangle'
    );

    startMusic();

    S.innerHTML = `
      <section class="scene">

        <div class="k">
          ACCESS GRANTED
        </div>

        <h2>
          I KNEW YOU'D TAP IT 😂
        </h2>

        <p class="sub">
          Choose a path.
          One of them hides the next clue.
        </p>

        <button class="btn" id="b">
          OPEN SECRET MAP
        </button>

      </section>
    `;

    b.onclick = next;

  };

}


/* =========================
   2. SECRET DOORS
========================= */

function doors() {

  S.innerHTML = `
    <section class="scene">

      <div class="k">
        chapter 20 • secret map
      </div>

      <h2>
        Where should we start?
      </h2>

      <p class="sub">
        Only one door unlocks the trail.
      </p>

      <div class="grid">

        <button class="card" data-ok="0">
          🌴
          <b>The Trip</b>
          <small>old roads</small>
        </button>

        <button class="card" data-ok="1">
          ✨
          <b>The Secret</b>
          <small>follow this</small>
        </button>

        <button class="card" data-ok="0">
          🎓
          <b>The Classroom</b>
          <small>chaos inside</small>
        </button>

        <button class="card" data-ok="0">
          🎁
          <b>The Gift</b>
          <small>not yet</small>
        </button>

      </div>

    </section>
  `;

  document
    .querySelectorAll('.card')
    .forEach(x => {

      x.onclick = () => {

        if (x.dataset.ok === '1') {

          snd(
            820,
            .16,
            'triangle'
          );

          next();

        } else {

          snd(
            130,
            .1,
            'square'
          );

          x.animate(
            [
              {
                transform:
                  'translateX(-6px)'
              },
              {
                transform:
                  'translateX(6px)'
              },
              {
                transform:
                  'none'
              }
            ],
            180
          );

        }

      };

    });

}


/* =========================
   3. CATCH THE SPARK
   FIVE EXPLODING SPARKS
========================= */

function orb() {

  S.innerHTML = `
    <section class="scene">

      <div class="k">
        mini game • 5 sparks
      </div>

      <h2>
        Catch the spark ✨
      </h2>

      <p class="sub">
        Tap a spark —
        but watch it EXPLODE
        before the next one appears.
      </p>

      <b id="n">
        0 / 5
      </b>

      <div
        class="orbarea"
        id="orbarea">
      </div>

    </section>
  `;

  let n = 0;

  const area =
    document.getElementById('orbarea');


  function spawn() {

    const o =
      document.createElement('button');

    o.className = 'orb';

    o.setAttribute(
      'aria-label',
      'spark'
    );

    o.style.left =
      (Math.random() * 78 + 4) + '%';

    o.style.top =
      (Math.random() * 68 + 5) + '%';

    area.appendChild(o);


    o.onclick = () => {

      n++;

      document.getElementById(
        'n'
      ).textContent =
        n + ' / 5';

      burstSound();

      o.classList.add(
        'blast'
      );


      /* Explosion particles */

      for (
        let i = 0;
        i < 12;
        i++
      ) {

        const p =
          document.createElement('i');

        p.className =
          'sparkbit';

        p.style.setProperty(
          '--a',
          (i * 30) + 'deg'
        );

        o.appendChild(p);

      }


      setTimeout(() => {

        o.remove();

        if (n < 5) {

          spawn();

        } else {

          setTimeout(
            next,
            650
          );

        }

      }, 420);

    };

  }

  spawn();

}


/* =========================
   4. ONE TAP GIFT
========================= */

function gift() {

  S.innerHTML = `
    <section class="scene">

      <div class="k">
        something is waiting
      </div>

      <h2>
        Open the gift
      </h2>

      <p class="sub">
        One tap.
        One surprise. 🎁
      </p>

      <div
        class="gift"
        id="g">

        <div class="box"></div>

        <div class="lid"></div>

        <div class="ribbon"></div>

        <div class="bow">
          🎀
        </div>

      </div>

      <b id="t">
        TAP ONCE
      </b>

    </section>
  `;

  let opened = false;


  g.onclick = () => {

    if (opened)
      return;

    opened = true;

    t.textContent =
      'SURPRISE! ✨';


    snd(
      330,
      .18,
      'triangle'
    );

    setTimeout(
      () =>
        snd(
          660,
          .22,
          'sine'
        ),
      110
    );


    g.classList.add(
      'open',
      'giftblast'
    );


    for (
      let i = 0;
      i < 18;
      i++
    ) {

      const p =
        document.createElement('i');

      p.className =
        'giftbit';

      p.style.setProperty(
        '--a',
        (i * 20) + 'deg'
      );

      g.appendChild(p);

    }


    setTimeout(
      next,
      1150
    );

  };

}


/* =========================
   5. MEMORIES
========================= */

function memories() {

  S.innerHTML = `

    <section class="scene">

      <div class="k">
        memory trail • ${mem + 1}/7
      </div>

      <h2>
        ${caps[mem]}
      </h2>

      <div class="mem">

        <img
          src="${photos[mem]}"
          alt="Chanty memory">

        <div class="meminfo">

          <b>
            Chanty • Chapter 20
          </b>

          <span>
            ${mem + 1}/7
          </span>

        </div>

      </div>

      <div class="hint">
        ← Swipe photo →
      </div>

      <button
        class="btn"
        id="mn">

        ${mem === 6
          ? 'Continue'
          : 'Next memory'}

      </button>

    </section>

  `;


  let sx = 0;

  const c =
    document.querySelector(
      '.mem'
    );


  c.ontouchstart =
    e =>
      sx =
        e.touches[0].clientX;


  c.ontouchend =
    e => {

      const d =
        e.changedTouches[0]
        .clientX - sx;

      if (
        Math.abs(d) > 45
      ) {

        if (
          d < 0 &&
          mem < 6
        ) {

          mem++;

          render();

        }

        else if (
          d > 0 &&
          mem > 0
        ) {

          mem--;

          render();

        }

      }

    };


  mn.onclick = () =>
    mem < 6
      ? (
          mem++,
          render()
        )
      : next();

}


/* =========================
   6. MEMORY REACTOR
   REPLACES BALLOONS
========================= */

function challenge() {

  S.innerHTML = `

    <section class="scene">

      <div class="k">
        chapter 20 • memory reactor
      </div>

      <h2>
        Unlock the Memory Reactor ⚡
      </h2>

      <p class="sub">
        Tap the glowing symbol
        shown at the top.
        Get 6 correct to unlock
        the next chapter.
      </p>

      <div
        class="target"
        id="target">
        ◆
      </div>

      <div
        class="reactor"
        id="reactor">
      </div>

      <b id="rc">
        0 / 6
      </b>

    </section>

  `;


  const symbols = [
    '◆',
    '✦',
    '●',
    '▲',
    '♥',
    '★'
  ];

  const reactor =
    document.getElementById(
      'reactor'
    );

  let score = 0;


  function round() {

    reactor.innerHTML = '';


    const target =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    document.getElementById(
      'target'
    ).textContent =
      target;


    symbols
      .slice()
      .sort(
        () =>
          Math.random() - .5
      )
      .forEach(sym => {

        const b =
          document.createElement(
            'button'
          );

        b.className =
          'react';

        b.textContent =
          sym;


        b.onclick = () => {

          if (
            sym === target
          ) {

            score++;

            snd(
              740,
              .12,
              'triangle'
            );

            document.getElementById(
              'rc'
            ).textContent =
              score + ' / 6';


            b.classList.add(
              'correct'
            );


            if (
              score === 6
            ) {

              setTimeout(
                next,
                600
              );

            } else {

              setTimeout(
                round,
                220
              );

            }

          } else {

            snd(
              110,
              .1,
              'square'
            );

            b.classList.add(
              'wrong'
            );


            setTimeout(
              () =>
                b.classList.remove(
                  'wrong'
                ),
              250
            );

          }

        };


        reactor.appendChild(b);

      });

  }


  round();

}


/* =========================
   7. HOW OLD IS CHANTY?
========================= */

function quiz() {

  S.innerHTML = `

    <section class="scene">

      <div class="k">
        final check
      </div>

      <h2>
        How old is Chanty?
      </h2>

      <p class="sub">
        Pick the correct answer.
      </p>

      <div class="quiz">

        ${[
          18,
          19,
          20,
          21
        ]
        .map(
          x => `
            <button
              class="choice"
              data-x="${x}">
              ${x}
            </button>
          `
        )
        .join('')}

      </div>

    </section>

  `;


  document
    .querySelectorAll('.choice')
    .forEach(x => {

      x.onclick = () => {

        if (
          x.dataset.x === '20'
        ) {

          magicAge(x);

        } else {

          snd(
            150,
            .1,
            'square'
          );

          x.textContent =
            'NOPE 😂';


          setTimeout(
            () =>
              x.textContent =
                x.dataset.x,
            600
          );

        }

      };

    });

}


/* =========================
   MAGIC AGE REVEAL
========================= */

function magicAge(button) {

  snd(
    440,
    .12,
    'triangle'
  );

  button.classList.add(
    'magicage'
  );


  const rect =
    button.getBoundingClientRect();


  for (
    let i = 0;
    i < 24;
    i++
  ) {

    const p =
      document.createElement('i');

    p.className =
      'agebit';

    p.style.left =
      rect.left +
      rect.width / 2 +
      'px';

    p.style.top =
      rect.top +
      rect.height / 2 +
      'px';

    p.style.setProperty(
      '--a',
      (i * 15) + 'deg'
    );


    document.body.appendChild(
      p
    );


    setTimeout(
      () => p.remove(),
      900
    );

  }


  setTimeout(
    next,
    850
  );

}


/* =========================
   8. COUNTDOWN
========================= */

function countdown() {

  S.innerHTML = `

    <section class="scene">

      <div class="k">
        get ready
      </div>

      <div
        style="
          font-size:70px;
          font-weight:800
        "
        id="cd">
        3
      </div>

      <p class="sub">
        Something is about to explode.
      </p>

    </section>

  `;


  let n = 3;


  const t =
    setInterval(() => {

      n--;


      if (n === 0) {

        clearInterval(t);

        next();

      } else {

        cd.textContent =
          n;

        snd(
          440,
          .12,
          'triangle'
        );

      }

    }, 800);

}


/* =========================
   9. PERSONAL MESSAGE
========================= */

function message() {

  const messageText = `
    Hey Chanty,<br><br>

    20 isn't just another number.
    It's another chapter filled with
    new places, new memories,
    new adventures and plenty of
    moments that will someday become
    stories we laugh about.<br><br>

    From travelling together to all
    those classroom moments, some of
    the best memories are simply the
    ones we never planned.<br><br>

    So here's to more journeys,
    more laughs, more crazy moments
    and many more memories waiting
    to happen.<br><br>

    Keep smiling.
    Keep being you. ❤️<br><br>

    <b>
      Happy 20th Birthday, Chanty! 🎂
    </b>
  `;


  S.innerHTML = `

    <section class="scene">

      <div class="k">
        a message from me to you
      </div>

      <h2>
        Before the last surprise…
      </h2>

      <div
        class="msg"
        id="m">
      </div>

    </section>

  `;


  let i = 0;


  function type() {

    const m =
      document.getElementById(
        'm'
      );


    m.innerHTML =
      messageText.slice(
        0,
        ++i
      );


    if (
      i < messageText.length
    ) {

      setTimeout(
        type,
        15
      );

    } else {

      setTimeout(
        next,
        1200
      );

    }

  }


  type();

}


/* =========================
   10. FINAL REVEAL
========================= */

function finale() {

  S.innerHTML = `

    <section class="scene">

      <div class="k">
        wait…
      </div>

      <h2>
        There’s one last thing 👀
      </h2>

      <p class="sub">
        You thought that was the end?
      </p>

      <button
        class="btn"
        id="r">

        REVEAL CHAPTER 20

      </button>

    </section>

  `;


  r.onclick = () => {

    S.innerHTML = `

      <section
        class="scene finalscene">

        <div class="k">
          THE NEXT CHAPTER
        </div>

        <h1>
          HAPPY BIRTHDAY
          <br>
          CHANTY ❤️
        </h1>

        <p class="sub">
          20 years • countless memories
          • many more to come
        </p>

        <img
          class="final"
          src="${photos[6]}"
          alt="Chanty">

        <p>
          CHAPTER 20 IS
          OFFICIALLY OPEN ✨
        </p>

      </section>

    `;


    bar.style.width =
      '100%';


    burstSound();

    startFireworks();

  };

}


/* =========================
   FINAL FIREWORKS
========================= */

function startFireworks() {

  const canvas =
    document.createElement(
      'canvas'
    );

  canvas.id =
    'fireworks';

  document.body.appendChild(
    canvas
  );


  const ctx =
    canvas.getContext('2d');


  let W =
    canvas.width =
      innerWidth;

  let H =
    canvas.height =
      innerHeight;


  addEventListener(
    'resize',
    () => {

      W =
        canvas.width =
          innerWidth;

      H =
        canvas.height =
          innerHeight;

    }
  );


  const rockets = [];
  const parts = [];


  function launch() {

    rockets.push({

      x:
        Math.random() * W,

      y:
        H + 10,

      tx:
        W * .12 +
        Math.random() * W * .76,

      ty:
        H * .12 +
        Math.random() * H * .42,

      v:
        -Math.random() * 8 - 7

    });

  }


  function explode(x,y) {

    for (
      let i = 0;
      i < 70;
      i++
    ) {

      const a =
        Math.random() *
        Math.PI * 2;

      const s =
        Math.random() * 6 + 2;


      parts.push({

        x,
        y,

        vx:
          Math.cos(a) * s,

        vy:
          Math.sin(a) * s,

        life:1,

        size:
          Math.random() * 2 + 1

      });

    }


    snd(
      240 +
      Math.random() * 500,
      .1,
      'sine'
    );

  }


  const start =
    performance.now();


  function loop(now) {

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    ctx.fillStyle =
      'rgba(3,2,10,.16)';

    ctx.fillRect(
      0,
      0,
      W,
      H
    );


    if (
      now - start < 9000 &&
      Math.random() < .055
    ) {

      launch();

    }


    rockets.forEach(
      (q,i) => {

        q.y += q.v;

        q.v += .13;


        ctx.beginPath();

        ctx.arc(
          q.x,
          q.y,
          2,
          0,
          7
        );

        ctx.fillStyle =
          '#fff';

        ctx.fill();


        if (
          q.y <= q.ty
        ) {

          explode(
            q.x,
            q.y
          );

          rockets.splice(
            i,
            1
          );

        }

      }
    );


    for (
      let i =
        parts.length - 1;
      i >= 0;
      i--
    ) {

      const p =
        parts[i];


      p.x += p.vx;
      p.y += p.vy;

      p.vy += .045;
      p.vx *= .99;

      p.life -= .012;


      ctx.globalAlpha =
        Math.max(
          0,
          p.life
        );


      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        7
      );


 
