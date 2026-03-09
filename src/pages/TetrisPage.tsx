import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CSS = `:root{
  --bg:#030810;--panel:#060f20;--border:#0e2035;
  --snake:#00ffaa;--accent:#00c8ff;--gold:#ffd700;--food:#ff2d6b;
  --glow-g:0 0 8px #00ffaa,0 0 20px #00ffaa88;
  --glow-b:0 0 8px #00c8ff,0 0 20px #00c8ff88;
  --glow-r:0 0 8px #ff2d6b,0 0 20px #ff2d6b88;
  --glow-gold:0 0 8px #ffd700,0 0 20px #ffd70088;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;background:var(--bg);color:#8eaabb;font-family:'Share Tech Mono',monospace;user-select:none;overscroll-behavior:none;}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:500;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,170,.004) 2px,rgba(0,255,170,.004) 4px);}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 40%,rgba(0,0,0,.35) 100%);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.72}}
@keyframes flicker{0%,90%,100%{opacity:1}92%{opacity:.85}94%{opacity:1}96%{opacity:.75}98%{opacity:1}}
@keyframes fadeIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes lineClear{0%{opacity:1;transform:scaleY(1)}50%{opacity:1;transform:scaleY(.1);filter:brightness(3)}100%{opacity:0;transform:scaleY(0)}}

/* ── Layout ── */
#layout{
  display:grid;
  grid-template-columns:auto 1fr auto;
  grid-template-rows:auto 1fr;
  grid-template-areas:"topbar topbar topbar" "left canvas right";
  height:100vh;height:100dvh;
  max-width:900px;margin:0 auto;
  padding:16px;gap:12px;
  position:relative;z-index:1;
}

/* ── Top bar ── */
#topbar{grid-area:topbar;display:flex;align-items:center;justify-content:space-between;gap:12px;}
#topbar h1{font-family:'Orbitron',sans-serif;font-weight:900;font-size:clamp(1.2rem,3vw,2rem);letter-spacing:.25em;color:var(--accent);text-shadow:var(--glow-b);animation:pulse 2s ease-in-out infinite;flex:1;text-align:center;}
.top-btn{font-family:'Orbitron',sans-serif;font-size:.7rem;letter-spacing:.12em;padding:8px 16px;border:1px solid var(--border);background:transparent;color:#445566;cursor:pointer;border-radius:6px;transition:all .2s;white-space:nowrap;text-decoration:none;display:inline-block;}
.top-btn:hover{border-color:var(--accent);color:var(--accent);}
.top-btn:active{background:rgba(0,200,255,.08);}

/* ── Left panel (hold + stats) ── */
#left-panel{grid-area:left;width:130px;display:flex;flex-direction:column;gap:10px;}
/* ── Right panel (next + controls) ── */
#right-panel{grid-area:right;width:130px;display:flex;flex-direction:column;gap:10px;}

.panel-card{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:12px 14px;}
.card-label{font-size:.58rem;letter-spacing:.2em;color:#556677;margin-bottom:8px;}
.stat-row{display:flex;justify-content:space-between;align-items:baseline;padding:3px 0;border-bottom:1px solid #0a1a28;font-size:.78rem;color:#556677;letter-spacing:.08em;}
.stat-row:last-child{border-bottom:none;}
.stat-row span{color:var(--accent);font-size:1rem;}
.stat-row.gold span{color:var(--gold);text-shadow:var(--glow-gold);}

/* ── Mini canvas for hold/next ── */
.mini-canvas{display:block;margin:0 auto;}

/* ── Main canvas ── */
#canvas-area{grid-area:canvas;display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;}
#gameCanvas{border:1px solid rgba(0,200,255,.2);box-shadow:0 0 40px rgba(0,200,255,.08),inset 0 0 40px rgba(0,0,0,.5);image-rendering:pixelated;display:block;touch-action:none;border-radius:4px;}

/* ── Controls card ── */
.ctrl-card{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:12px 14px;font-size:.6rem;color:#556677;line-height:2;letter-spacing:.06em;}
kbd{background:#0a1628;border:1px solid #1a3050;border-radius:3px;padding:1px 4px;color:#6a8899;font-family:'Share Tech Mono',monospace;font-size:.58rem;}
.side-btn{font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:.12em;padding:9px;border:1px solid var(--border);background:transparent;color:#445566;cursor:pointer;border-radius:6px;transition:all .2s;width:100%;}
.side-btn:hover{border-color:var(--accent);color:var(--accent);background:rgba(0,200,255,.04);}

/* ── D-Pad (mobile) ── */
#dpad{display:none;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:12px;align-items:center;justify-content:center;flex-direction:column;gap:4px;}
.dpad-row{display:flex;gap:4px;}
.dpad-btn{width:clamp(48px,14vw,62px);height:clamp(48px,14vw,62px);background:#0a1628;border:1px solid rgba(0,200,255,.2);border-radius:10px;color:var(--accent);font-size:clamp(1rem,4vw,1.3rem);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .08s;touch-action:manipulation;}
.dpad-btn:active{background:rgba(0,200,255,.1);box-shadow:0 0 16px rgba(0,200,255,.3);}
.dpad-center{background:var(--panel);color:#334455;font-size:clamp(.5rem,1.8vw,.6rem);letter-spacing:.06em;font-family:'Share Tech Mono',monospace;border-color:#1a3050;}
.dpad-center:active{background:rgba(0,200,255,.08);color:var(--accent);}

/* ═══════════ MOBILE ═══════════ */
@media(max-width:699px){
  #layout{
    grid-template-columns:1fr 1fr;
    grid-template-rows:auto auto auto auto;
    grid-template-areas:"topbar topbar" "canvas canvas" "left right" "dpad dpad";
    height:auto;min-height:100dvh;
    padding:10px 10px max(env(safe-area-inset-bottom,10px),10px);
    gap:8px;max-width:480px;overflow-y:auto;
  }
  #left-panel{width:auto;}
  #right-panel{width:auto;}
  #dpad{display:flex;}
  .ctrl-card{display:none;}
}

/* ═══════════ OVERLAYS ═══════════ */
.screen{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(3,8,16,.94);z-index:50;gap:16px;padding:24px clamp(16px,5vw,40px);overflow-y:auto;}
.screen.active{display:flex;}

.ov-title{font-family:'Orbitron',sans-serif;font-weight:700;font-size:clamp(1.6rem,5vw,2.4rem);letter-spacing:.22em;}
.ov-title.cyan{color:var(--accent);text-shadow:var(--glow-b);}
.ov-title.red{color:var(--food);text-shadow:var(--glow-r);}

.ov-stat{font-size:clamp(.85rem,3vw,1rem);color:#7799aa;letter-spacing:.12em;}
.ov-stat span{font-size:1.25em;}
.ov-stat.green span{color:var(--snake);text-shadow:var(--glow-g);}
.ov-stat.gold  span{color:var(--gold);text-shadow:var(--glow-gold);}

.primary-btn{font-family:'Orbitron',sans-serif;font-size:clamp(.85rem,2.5vw,1rem);letter-spacing:.2em;padding:14px 44px;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer;text-shadow:var(--glow-b);box-shadow:0 0 20px rgba(0,200,255,.15);transition:all .2s;border-radius:6px;min-height:52px;}
.primary-btn:hover{background:rgba(0,200,255,.08);box-shadow:0 0 32px rgba(0,200,255,.3);}
.ov-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
.ov-btn{font-family:'Orbitron',sans-serif;font-size:.68rem;letter-spacing:.15em;padding:10px 20px;border:1px solid var(--border);background:transparent;color:#445566;cursor:pointer;border-radius:6px;transition:all .2s;min-height:44px;text-decoration:none;display:inline-flex;align-items:center;}
.ov-btn:hover{border-color:var(--accent);color:var(--accent);}
.rec-text{font-size:.7rem;color:var(--snake);letter-spacing:.12em;}

/* ── Menu ── */
#menu-overlay{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:flex-end;z-index:60;background:rgba(3,8,16,.6);backdrop-filter:blur(6px);}
#menu-overlay.active{display:flex;}
#menu-sheet{background:var(--panel);border:1px solid #1a3050;border-bottom:none;border-radius:18px 18px 0 0;width:100%;max-width:520px;padding:20px 20px max(env(safe-area-inset-bottom,20px),20px);display:flex;flex-direction:column;gap:10px;animation:slideUp .22s ease;}
.menu-title{font-family:'Orbitron',sans-serif;font-size:.7rem;letter-spacing:.28em;color:#334455;text-align:center;margin-bottom:2px;}
.menu-item{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#0a1628;border:1px solid #1a3050;border-radius:10px;cursor:pointer;text-decoration:none;color:inherit;transition:border-color .15s,background .15s;width:100%;text-align:left;}
.menu-item:hover{border-color:var(--accent);background:rgba(0,200,255,.05);}
.menu-icon{font-size:1.4rem;width:30px;text-align:center;}
.menu-item-name{font-family:'Orbitron',sans-serif;font-size:.72rem;letter-spacing:.12em;color:var(--accent);}
.menu-item-desc{font-size:.58rem;color:#556677;letter-spacing:.05em;margin-top:1px;}
.menu-divider{height:1px;background:var(--border);margin:2px 0;}
.menu-close{font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:.18em;padding:12px;border:1px solid #1a3050;background:transparent;color:#445566;cursor:pointer;border-radius:10px;transition:all .15s;}
.menu-close:hover{border-color:#556677;color:#7799aa;}

/* ── Toast ── */
#toast{position:fixed;top:max(env(safe-area-inset-top,0px),16px);left:50%;transform:translateX(-50%) translateY(-80px);background:#0a1628;border:1px solid rgba(0,200,255,.27);border-radius:8px;padding:9px 20px;font-size:.78rem;letter-spacing:.09em;color:var(--accent);z-index:400;transition:transform .3s ease;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.5);}
#toast.show{transform:translateX(-50%) translateY(0);}
`

const BODY_HTML = `<div id="layout">
  <!-- Top bar -->
  <div id="topbar">
    <a class="top-btn" data-nav="/">← ARCADE</a>
    <h1>NEON TETRIS</h1>
    <button class="top-btn" id="menu-btn">☰ MENU</button>
  </div>

  <!-- Left panel -->
  <div id="left-panel">
    <div class="panel-card">
      <div class="card-label">HOLD</div>
      <canvas class="mini-canvas" id="holdCanvas" width="100" height="80"></canvas>
    </div>
    <div class="panel-card">
      <div class="card-label">STATS</div>
      <div class="stat-row">SCORE <span id="hud-score">0</span></div>
      <div class="stat-row">BEST  <span id="hud-best">0</span></div>
      <div class="stat-row">LEVEL <span id="hud-level">1</span></div>
      <div class="stat-row">LINES <span id="hud-lines">0</span></div>
    </div>
  </div>

  <!-- Canvas -->
  <div id="canvas-area">
    <canvas id="gameCanvas" width="200" height="400"></canvas>
  </div>

  <!-- Right panel -->
  <div id="right-panel">
    <div class="panel-card">
      <div class="card-label">NEXT</div>
      <canvas class="mini-canvas" id="nextCanvas" width="100" height="200"></canvas>
    </div>
    <div class="ctrl-card">
      <div class="card-label">CONTROLS</div>
      <kbd>←</kbd><kbd>→</kbd> move<br>
      <kbd>↑</kbd> / <kbd>Z</kbd> rotate<br>
      <kbd>↓</kbd> soft drop<br>
      <kbd>Space</kbd> hard drop<br>
      <kbd>C</kbd> hold<br>
      <kbd>P</kbd> pause
    </div>
    <button class="side-btn" id="rules-btn">? HOW TO PLAY</button>
  </div>

  <!-- D-Pad (mobile) -->
  <div id="dpad">
    <div class="dpad-row">
      <button class="dpad-btn" id="dp-rotl">↺</button>
      <button class="dpad-btn" id="dp-up">▲</button>
      <button class="dpad-btn" id="dp-rotr">↻</button>
    </div>
    <div class="dpad-row">
      <button class="dpad-btn" id="dp-left">◀</button>
      <button class="dpad-btn dpad-center" id="dp-pause">II</button>
      <button class="dpad-btn" id="dp-right">▶</button>
    </div>
    <div class="dpad-row">
      <button class="dpad-btn" id="dp-hold">C</button>
      <button class="dpad-btn" id="dp-down">▼</button>
      <button class="dpad-btn" id="dp-drop">⤓</button>
    </div>
  </div>
</div>

<!-- Start / Game-Over overlay -->
<div class="screen active" id="main-screen">
  <h2 class="ov-title cyan" id="ov-title">NEON TETRIS</h2>
  <div class="ov-stat green" id="ov-score" style="display:none">SCORE: <span id="ov-score-val">0</span></div>
  <div class="ov-stat gold"  id="ov-lines" style="display:none">LINES: <span id="ov-lines-val">0</span></div>
  <button class="primary-btn" id="start-btn">PLAY</button>
  <div class="ov-btns">
    <button class="ov-btn" id="ov-how-btn">? HELP</button>
    <a class="ov-btn" data-nav="/">← ARCADE</a>
  </div>
  <div class="rec-text" id="rec-text"></div>
</div>

<!-- Tutorial overlay -->
<div class="screen" id="tut-screen">
  <div style="display:flex;flex-direction:column;align-items:center;gap:clamp(14px,3vw,22px);width:100%;max-width:400px;padding:clamp(16px,4vw,32px) clamp(14px,4vw,24px);">
    <div id="tut-progress" style="display:flex;gap:8px;"></div>
    <div id="tut-steps" style="width:100%;"></div>
    <div style="display:flex;gap:12px;">
      <button class="ov-btn" id="tut-skip">SKIP</button>
      <button class="primary-btn" id="tut-next" style="padding:10px 28px;font-size:.8rem;">NEXT ▶</button>
    </div>
  </div>
</div>

<!-- Menu overlay -->
<div id="menu-overlay">
  <div id="menu-sheet">
    <div class="menu-title">MENU</div>
    <button class="menu-item" id="menu-how">
      <span class="menu-icon">❓</span>
      <div><div class="menu-item-name">HOW TO PLAY</div><div class="menu-item-desc">View the tutorial</div></div>
    </button>
    <div class="menu-divider"></div>
    <a class="menu-item" data-nav="/">
      <span class="menu-icon">🕹️</span>
      <div><div class="menu-item-name">ARCADE</div><div class="menu-item-desc">Back to game selection</div></div>
    </a>
    <button class="menu-close" id="menu-close">✕ CLOSE</button>
  </div>
</div>

<!-- Toast -->
<div id="toast"></div>`

const GAME_SCRIPT = `// ═══════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════
const COLS = 10, ROWS = 20, CELL = 20;
const W = COLS * CELL, H = ROWS * CELL; // 200 × 400

// Piece definitions [rotations][rows][cols]
const PIECES = {
  I: { color: '#00c8ff', glow: '#00c8ff88', shapes: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ]},
  O: { color: '#ffd700', glow: '#ffd70088', shapes: [
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
  ]},
  T: { color: '#bb44ff', glow: '#bb44ff88', shapes: [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ]},
  S: { color: '#00ffaa', glow: '#00ffaa88', shapes: [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ]},
  Z: { color: '#ff2d6b', glow: '#ff2d6b88', shapes: [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ]},
  J: { color: '#4488ff', glow: '#4488ff88', shapes: [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ]},
  L: { color: '#ff8800', glow: '#ff880088', shapes: [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ]},
};

// SRS wall kicks for J,L,S,T,Z (I has its own)
const KICKS = {
  default: [
    [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  ],
  I: [
    [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
    [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  ],
};

const PIECE_KEYS = Object.keys(PIECES);

// Scoring
const LINE_SCORES = [0, 100, 300, 500, 800];
const BASE_SPEED  = 800;
const MIN_SPEED   = 60;

// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
const canvas     = document.getElementById('gameCanvas');
const ctx        = canvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const hctx       = holdCanvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nctx       = nextCanvas.getContext('2d');

let board, piece, nextQueue, holdPiece, holdUsed;
let score, highscore, level, lines;
let gameOver, paused;
let dropTimer, lastDrop;
let animFrame;
let canvasScale = 1;

function loadHighscore() {
  return parseInt(localStorage.getItem('tetrisHigh') || '0');
}
function saveHighscore(v) {
  localStorage.setItem('tetrisHigh', String(v));
}

highscore = loadHighscore();
document.getElementById('hud-best').textContent = highscore;

// ═══════════════════════════════════════════════════════
//  CANVAS RESIZE
// ═══════════════════════════════════════════════════════
function resizeCanvas() {
  const area = document.getElementById('canvas-area');
  const maxH = area.clientHeight || window.innerHeight * 0.65;
  const maxW = area.clientWidth  || window.innerWidth  * 0.5;
  const scale = Math.max(1, Math.floor(Math.min(maxW / W, maxH / H)));
  canvasScale = scale;
  canvas.style.width  = (W * scale) + 'px';
  canvas.style.height = (H * scale) + 'px';
}
window.addEventListener('resize', () => { resizeCanvas(); if(gameOver || paused) drawAll(); });
window.addEventListener('orientationchange', () => setTimeout(() => { resizeCanvas(); drawAll(); }, 250));

// ═══════════════════════════════════════════════════════
//  PIECE HELPERS
// ═══════════════════════════════════════════════════════
function randomBag() {
  // 7-bag randomizer
  const bag = [...PIECE_KEYS];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

let bag = [];
function nextFromBag() {
  if (bag.length === 0) bag = randomBag();
  return bag.shift();
}

function newPiece(key) {
  const p = PIECES[key];
  return { key, rot: 0, color: p.color, glow: p.glow,
    x: key === 'O' ? 3 : key === 'I' ? 3 : 3,
    y: key === 'I' ? -1 : 0,
    shape: () => PIECES[key].shapes[piece.rot % PIECES[key].shapes.length] };
}

function spawnNext() {
  while (nextQueue.length < 5) nextQueue.push(nextFromBag());
  const key = nextQueue.shift();
  piece = newPiece(key);
  piece.shape = () => PIECES[piece.key].shapes[piece.rot % PIECES[piece.key].shapes.length];
  holdUsed = false;
  if (!valid(piece, 0, 0)) { endGame(); }
}

function shape(p) {
  return PIECES[p.key].shapes[p.rot % PIECES[p.key].shapes.length];
}

function valid(p, dx, dy, rot) {
  const r = (rot !== undefined) ? rot : p.rot;
  const s = PIECES[p.key].shapes[((r % PIECES[p.key].shapes.length) + PIECES[p.key].shapes.length) % PIECES[p.key].shapes.length];
  for (let row = 0; row < s.length; row++) {
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const nx = p.x + col + dx;
      const ny = p.y + row + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function rotate(cw) {
  const newRot = (piece.rot + (cw ? 1 : -1) + 4) % 4; // always 0-3 mod
  const kicks  = piece.key === 'I' ? KICKS.I : KICKS.default;
  const kickSet = cw ? kicks[piece.rot % 4] : kicks[newRot % 4].map(([x,y]) => [-x,-y]);
  for (const [kx, ky] of kickSet) {
    if (valid(piece, kx, ky, newRot)) {
      piece.rot = newRot;
      piece.x += kx;
      piece.y += ky;
      return;
    }
  }
}

function hardDrop() {
  let dy = 0;
  while (valid(piece, 0, dy + 1)) dy++;
  piece.y += dy;
  score += dy * 2 * level;
  lock();
}

function softDrop() {
  if (valid(piece, 0, 1)) { piece.y++; score += level; }
  else lock();
}

function lock() {
  const s = shape(piece);
  for (let row = 0; row < s.length; row++) {
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const ny = piece.y + row;
      if (ny < 0) { endGame(); return; }
      board[ny][piece.x + col] = { color: piece.color, glow: piece.glow };
    }
  }
  clearLines();
  spawnNext();
  updateHud();
  drawAll();
  resetDrop();
}

function clearLines() {
  const full = [];
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every(c => c)) full.push(r);
  }
  if (full.length === 0) return;

  // Flash and remove
  full.forEach(r => {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) board[r][c].flash = true;
    }
  });
  drawAll();

  setTimeout(() => {
    for (let i = full.length - 1; i >= 0; i--) {
      board.splice(full[i], 1);
      board.unshift(Array(COLS).fill(null));
    }
    const gained = LINE_SCORES[full.length] * level;
    score += gained;
    lines += full.length;
    if (score > highscore) { highscore = score; saveHighscore(highscore); }
    level = Math.floor(lines / 10) + 1;
    if (full.length === 4) showToast('✦ TETRIS! ×' + (LINE_SCORES[4] * level) + ' pts');
    else if (full.length === 3) showToast('▲ TRIPLE! ×' + (LINE_SCORES[3] * level) + ' pts');
    updateHud();
    drawAll();
    resetDrop();
  }, 120);
}

function hold() {
  if (holdUsed) return;
  holdUsed = true;
  const key = piece.key;
  if (holdPiece) {
    const prev = holdPiece;
    holdPiece = key;
    piece = newPiece(prev);
    piece.shape = () => PIECES[piece.key].shapes[piece.rot % PIECES[piece.key].shapes.length];
  } else {
    holdPiece = key;
    spawnNext();
  }
  drawAll();
}

function ghostY() {
  let dy = 0;
  while (valid(piece, 0, dy + 1)) dy++;
  return piece.y + dy;
}

// ═══════════════════════════════════════════════════════
//  DRAW
// ═══════════════════════════════════════════════════════
function drawBlock(ctx, x, y, color, glow, alpha = 1, flash = false) {
  const px = x * CELL, py = y * CELL;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (flash) { ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 24; }
  else { ctx.shadowColor = glow || color; ctx.shadowBlur = 10; }
  ctx.fillStyle = flash ? '#ffffff' : color;
  ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
  // highlight
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  ctx.fillRect(px + 2, py + 2, CELL - 6, 4);
  ctx.restore();
}

function drawBoard() {
  ctx.fillStyle = '#030810';
  ctx.fillRect(0, 0, W, H);
  // Grid
  ctx.strokeStyle = '#0a1628'; ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }
  // Placed blocks
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (cell) drawBlock(ctx, c, r, cell.color, cell.glow, 1, cell.flash);
    }
  }
}

function drawGhost() {
  if (!piece) return;
  const gy = ghostY();
  const s = shape(piece);
  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let row = 0; row < s.length; row++) {
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const nx = piece.x + col, ny = gy + row;
      if (ny < 0) continue;
      ctx.fillStyle = piece.color;
      ctx.fillRect(nx*CELL+1, ny*CELL+1, CELL-2, CELL-2);
    }
  }
  ctx.restore();
}

function drawPiece() {
  if (!piece) return;
  const s = shape(piece);
  for (let row = 0; row < s.length; row++) {
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const nx = piece.x + col, ny = piece.y + row;
      if (ny < 0) continue;
      drawBlock(ctx, nx, ny, piece.color, piece.glow);
    }
  }
}

function drawMini(mctx, key, cw, ch, label) {
  mctx.fillStyle = '#030810';
  mctx.fillRect(0, 0, cw, ch);
  if (!key) return;
  const p = PIECES[key];
  const s = p.shapes[0];
  const rows = s.length, cols = s[0].length;
  const cellSize = Math.min(Math.floor(cw / (cols + 1)), Math.floor(ch / (rows + 1)));
  const offX = Math.floor((cw - cols * cellSize) / 2);
  const offY = Math.floor((ch - rows * cellSize) / 2);
  mctx.save();
  mctx.shadowColor = p.glow; mctx.shadowBlur = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!s[r][c]) continue;
      mctx.fillStyle = p.color;
      mctx.fillRect(offX + c * cellSize + 1, offY + r * cellSize + 1, cellSize - 2, cellSize - 2);
      mctx.fillStyle = 'rgba(255,255,255,.18)';
      mctx.fillRect(offX + c * cellSize + 2, offY + r * cellSize + 2, cellSize - 4, 3);
    }
  }
  mctx.restore();
}

function drawNextQueue() {
  nctx.fillStyle = '#030810';
  nctx.fillRect(0, 0, 100, 200);
  const slotH = 40;
  nextQueue.slice(0, 5).forEach((key, i) => {
    const p = PIECES[key];
    const s = p.shapes[0];
    const rows = s.length, cols = s[0].length;
    const cellSize = Math.min(Math.floor(90 / cols), Math.floor((slotH - 4) / rows));
    const offX = Math.floor((100 - cols * cellSize) / 2);
    const offY = i * slotH + Math.floor((slotH - rows * cellSize) / 2);
    nctx.save();
    nctx.shadowColor = p.glow; nctx.shadowBlur = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!s[r][c]) continue;
        nctx.fillStyle = p.color;
        nctx.fillRect(offX + c * cellSize + 1, offY + r * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    }
    nctx.restore();
  });
}

function drawPause() {
  ctx.fillStyle = 'rgba(0,200,255,.06)';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.shadowColor = '#00c8ff'; ctx.shadowBlur = 14;
  ctx.fillStyle = '#00c8ff';
  ctx.font = 'bold 18px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSE', W / 2, H / 2);
  ctx.restore();
}

function drawAll() {
  drawBoard();
  if (!gameOver) {
    drawGhost();
    drawPiece();
  }
  if (paused) drawPause();
  drawMini(hctx, holdPiece, 100, 80);
  drawNextQueue();
}

// ═══════════════════════════════════════════════════════
//  GAME LOOP
// ═══════════════════════════════════════════════════════
function speed() {
  return Math.max(MIN_SPEED, BASE_SPEED - (level - 1) * 65);
}

function resetDrop() {
  lastDrop = performance.now();
}

function gameLoop(ts) {
  if (gameOver || paused) return;
  if (ts - lastDrop >= speed()) {
    lastDrop = ts;
    if (valid(piece, 0, 1)) { piece.y++; }
    else { lock(); return; }
    drawAll();
  }
  animFrame = requestAnimationFrame(gameLoop);
}

function updateHud() {
  document.getElementById('hud-score').textContent = score;
  document.getElementById('hud-best').textContent  = highscore;
  document.getElementById('hud-level').textContent = level;
  document.getElementById('hud-lines').textContent = lines;
}

// ═══════════════════════════════════════════════════════
//  INIT / START / END
// ═══════════════════════════════════════════════════════
function initBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function startGame() {
  board     = initBoard();
  bag       = randomBag();
  nextQueue = [];
  while (nextQueue.length < 5) nextQueue.push(nextFromBag());
  holdPiece = null; holdUsed = false;
  score = 0; level = 1; lines = 0;
  gameOver = false; paused = false;

  // reset overlay
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('ov-title').className = 'ov-title cyan';
  document.getElementById('ov-title').textContent = 'NEON TETRIS';
  document.getElementById('ov-score').style.display = 'none';
  document.getElementById('ov-lines').style.display = 'none';
  document.getElementById('start-btn').textContent = 'PLAY AGAIN';
  document.getElementById('rec-text').textContent = '';

  spawnNext();
  updateHud();
  resizeCanvas();
  drawAll();
  lastDrop = performance.now();
  cancelAnimationFrame(animFrame);
  animFrame = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animFrame);
  if (score > highscore) { highscore = score; saveHighscore(highscore); }
  drawAll();

  document.getElementById('ov-title').className = 'ov-title red';
  document.getElementById('ov-title').textContent = 'GAME OVER';
  document.getElementById('ov-score').style.display = '';
  document.getElementById('ov-score-val').textContent = score;
  document.getElementById('ov-lines').style.display = '';
  document.getElementById('ov-lines-val').textContent = lines;
  document.getElementById('start-btn').textContent = 'PLAY AGAIN';
  document.getElementById('rec-text').textContent =
    score >= highscore && score > 0 ? '★ NEW RECORD! ★' : '';
  document.getElementById('main-screen').classList.add('active');
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) {
    lastDrop = performance.now();
    animFrame = requestAnimationFrame(gameLoop);
  }
  drawAll();
}

// ═══════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ═══════════════════════════════════════════════════════
//  KEYBOARD
// ═══════════════════════════════════════════════════════
const DAS_DELAY = 150, DAS_REPEAT = 40;
let dasDir = 0, dasTimer, dasRepeat;

function move(dx) {
  if (gameOver || paused || !piece) return;
  if (valid(piece, dx, 0)) { piece.x += dx; drawAll(); }
}

function startDAS(dx) {
  dasDir = dx;
  move(dx);
  clearTimeout(dasTimer); clearInterval(dasRepeat);
  dasTimer  = setTimeout(() => { dasRepeat = setInterval(() => move(dasDir), DAS_REPEAT); }, DAS_DELAY);
}

function stopDAS() {
  dasDir = 0;
  clearTimeout(dasTimer); clearInterval(dasRepeat);
}

document.addEventListener('keydown', e => {
  if (document.getElementById('tut-screen').classList.contains('active')) return;
  if (document.getElementById('main-screen').classList.contains('active')) {
    if (e.key === 'Enter') startGame();
    return;
  }
  switch (e.key) {
    case 'ArrowLeft':  e.preventDefault(); startDAS(-1); break;
    case 'ArrowRight': e.preventDefault(); startDAS(1);  break;
    case 'ArrowDown':  e.preventDefault(); if(!gameOver&&!paused){softDrop();drawAll();}break;
    case 'ArrowUp':    e.preventDefault(); if(!gameOver&&!paused){rotate(true);drawAll();}break;
    case ' ':          e.preventDefault(); if(!gameOver&&!paused){hardDrop();drawAll();}break;
    case 'z': case 'Z':if(!gameOver&&!paused){rotate(false);drawAll();}break;
    case 'c': case 'C':if(!gameOver&&!paused){hold();drawAll();}break;
    case 'p': case 'P':togglePause();break;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') stopDAS();
});

// ═══════════════════════════════════════════════════════
//  TOUCH SWIPE
// ═══════════════════════════════════════════════════════
let touchX, touchY, touchT;
canvas.addEventListener('touchstart', e => {
  touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; touchT = Date.now();
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', e => {
  if (gameOver || paused) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  const dt = Date.now() - touchT;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < 10 && dt < 200) { rotate(true); drawAll(); return; }
  if (dist < 12) return;
  if (Math.abs(dx) > Math.abs(dy)) { move(dx > 0 ? 1 : -1); }
  else if (dy > 40) { hardDrop(); }
  else if (dy < -20) { hold(); }
  drawAll();
  e.preventDefault();
}, { passive: false });

// ═══════════════════════════════════════════════════════
//  D-PAD BUTTONS
// ═══════════════════════════════════════════════════════
document.getElementById('dp-left') .addEventListener('click', () => { move(-1); drawAll(); });
document.getElementById('dp-right').addEventListener('click', () => { move(1);  drawAll(); });
document.getElementById('dp-down') .addEventListener('click', () => { if(!gameOver&&!paused){softDrop();drawAll();} });
document.getElementById('dp-drop') .addEventListener('click', () => { if(!gameOver&&!paused){hardDrop();drawAll();} });
document.getElementById('dp-rotl') .addEventListener('click', () => { if(!gameOver&&!paused){rotate(false);drawAll();} });
document.getElementById('dp-rotr') .addEventListener('click', () => { if(!gameOver&&!paused){rotate(true);drawAll();} });
document.getElementById('dp-hold') .addEventListener('click', () => { if(!gameOver&&!paused){hold();drawAll();} });
document.getElementById('dp-pause').addEventListener('click', togglePause);

// D-pad DAS for left/right
['dp-left','dp-right'].forEach(id => {
  const el = document.getElementById(id);
  const dx  = id === 'dp-left' ? -1 : 1;
  el.addEventListener('touchstart', e => { e.preventDefault(); startDAS(dx); }, { passive: false });
  el.addEventListener('touchend',   e => { e.preventDefault(); stopDAS(); },    { passive: false });
});

// ═══════════════════════════════════════════════════════
//  TUTORIAL
// ═══════════════════════════════════════════════════════
const TUT_STEPS = [
  { icon: '🧱', title: 'WELCOME!',       text: 'Falling tetrominoes — fit them together to clear lines and score points!' },
  { icon: '🕹️', title: 'MOVEMENT',       text: '<strong>← →</strong> to move, <strong>↓</strong> soft drop, <strong>Space</strong> hard drop.<br>On mobile use the D-Pad, or swipe.' },
  { icon: '↺',   title: 'ROTATION',       text: '<strong>↑</strong> or <strong>Z</strong> to rotate. Wall kicks let you slot pieces into tight gaps.' },
  { icon: '📦',  title: 'HOLD',           text: 'Press <strong>C</strong> (or the D-Pad C button) to hold a piece for later. One hold per piece.' },
  { icon: '✦',   title: 'SCORING',        text: '1 line = 100 · 2 lines = 300 · 3 lines = 500 · <strong>TETRIS (4 lines) = 800</strong> × level!' },
  { icon: '⚡',   title: 'LEVELS',        text: 'Every 10 lines cleared = +1 level. The higher the level, the faster the drop.' },
  { icon: '🚀',  title: 'READY!',         text: 'Use the NEXT queue to plan ahead and the HOLD slot for clutch saves. Good luck!' },
];

let tutStep = 0;

function renderTut() {
  const prog = document.getElementById('tut-progress');
  const steps = document.getElementById('tut-steps');
  prog.innerHTML = TUT_STEPS.map((_,i) =>
    \`<div style="width:9px;height:9px;border-radius:50%;background:\${i===tutStep?'var(--accent)':'#1a3050'};\${i===tutStep?'box-shadow:var(--glow-b)':''};transition:background .3s"></div>\`
  ).join('');
  const step = TUT_STEPS[tutStep];
  steps.innerHTML = \`
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;animation:fadeIn .3s ease;">
      <div style="font-size:clamp(2rem,6vw,2.8rem);filter:drop-shadow(0 0 10px rgba(0,200,255,.5))">\${step.icon}</div>
      <div style="font-family:'Orbitron',sans-serif;font-size:clamp(.85rem,3vw,1.05rem);letter-spacing:.2em;color:var(--accent)">\${step.title}</div>
      <div style="font-size:clamp(.7rem,2.2vw,.8rem);color:#7799aa;line-height:1.9;letter-spacing:.04em">\${step.text}</div>
    </div>\`;
  document.getElementById('tut-next').textContent = tutStep === TUT_STEPS.length - 1 ? '✓ DONE' : 'NEXT ▶';
}

function openTutorial() {
  tutStep = 0; renderTut();
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('menu-overlay').classList.remove('active');
  document.getElementById('tut-screen').classList.add('active');
}

function closeTutorial() {
  document.getElementById('tut-screen').classList.remove('active');
  if (gameOver || !piece) document.getElementById('main-screen').classList.add('active');
}

document.getElementById('tut-next').addEventListener('click', () => {
  if (tutStep < TUT_STEPS.length - 1) { tutStep++; renderTut(); }
  else closeTutorial();
});
document.getElementById('tut-skip').addEventListener('click', closeTutorial);
document.getElementById('rules-btn').addEventListener('click', () => { if(!gameOver)togglePause(); openTutorial(); });
document.getElementById('ov-how-btn').addEventListener('click', openTutorial);
document.getElementById('menu-how').addEventListener('click', openTutorial);

// ═══════════════════════════════════════════════════════
//  MENU
// ═══════════════════════════════════════════════════════
document.getElementById('menu-btn').addEventListener('click', () => {
  if (!gameOver && !paused) togglePause();
  document.getElementById('menu-overlay').classList.add('active');
});
document.getElementById('menu-close').addEventListener('click', () => {
  document.getElementById('menu-overlay').classList.remove('active');
  if (!gameOver && paused) togglePause();
});
document.getElementById('menu-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('menu-overlay')) {
    document.getElementById('menu-overlay').classList.remove('active');
    if (!gameOver && paused) togglePause();
  }
});

// ═══════════════════════════════════════════════════════
//  START BUTTON
// ═══════════════════════════════════════════════════════
document.getElementById('start-btn').addEventListener('click', startGame);

// ═══════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════
gameOver = true; paused = false;
board = initBoard();
resizeCanvas();
// draw empty board
ctx.fillStyle = '#030810'; ctx.fillRect(0, 0, W, H);
ctx.strokeStyle = '#0a1628'; ctx.lineWidth = 0.5;
for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }
hctx.fillStyle = '#030810'; hctx.fillRect(0,0,100,80);
nctx.fillStyle = '#030810'; nctx.fillRect(0,0,100,200);`

export default function TetrisPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef     = useRef<HTMLStyleElement | null>(null)
  const scriptRef    = useRef<HTMLScriptElement | null>(null)

  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  useEffect(() => {
    document.title = 'NEON TETRIS'

    const container = containerRef.current
    if (!container) return

    // Inject scoped stylesheet
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
    styleRef.current = style

    // Inject body HTML
    container.innerHTML = BODY_HTML

    // Wire data-nav links to React Router
    container.querySelectorAll<HTMLElement>('[data-nav]').forEach(el => {
      el.style.cursor = 'pointer'
      el.addEventListener('click', (e) => {
        e.preventDefault()
        navigateRef.current(el.dataset.nav ?? '/')
      })
    })

    // Run the game script
    const script = document.createElement('script')
    script.textContent = GAME_SCRIPT
    document.body.appendChild(script)
    scriptRef.current = script

    return () => {
      styleRef.current?.remove()
      scriptRef.current?.remove()
      if (containerRef.current) containerRef.current.innerHTML = ''
      // Clear any running intervals/timers injected by the game
      const highId = window.setInterval(() => { /* noop */ }, 99999) as number
      for (let i = 0; i <= highId; i++) window.clearInterval(i)
      const highRaf = window.requestAnimationFrame(() => { /* noop */ }) as number
      for (let i = 0; i <= highRaf; i++) window.cancelAnimationFrame(i)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', zIndex: 1 }}
    />
  )
}
