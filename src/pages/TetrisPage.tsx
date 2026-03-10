import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
:root{
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
#topbar{grid-area:topbar;display:flex;align-items:center;justify-content:space-between;gap:12px;}
#topbar h1{font-family:'Orbitron',sans-serif;font-weight:900;font-size:clamp(1.2rem,3vw,2rem);letter-spacing:.25em;color:var(--accent);text-shadow:var(--glow-b);animation:pulse 2s ease-in-out infinite;flex:1;text-align:center;}
.top-btn{font-family:'Orbitron',sans-serif;font-size:.7rem;letter-spacing:.12em;padding:8px 16px;border:1px solid var(--border);background:transparent;color:#445566;cursor:pointer;border-radius:6px;transition:all .2s;white-space:nowrap;text-decoration:none;display:inline-block;}
.top-btn:hover{border-color:var(--accent);color:var(--accent);}
.top-btn:active{background:rgba(0,200,255,.08);}

#left-panel{grid-area:left;width:130px;display:flex;flex-direction:column;gap:10px;}
#right-panel{grid-area:right;width:130px;display:flex;flex-direction:column;gap:10px;}

.panel-card{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:12px 14px;}
.card-label{font-size:.58rem;letter-spacing:.2em;color:#556677;margin-bottom:8px;}
.stat-row{display:flex;justify-content:space-between;align-items:baseline;padding:3px 0;border-bottom:1px solid #0a1a28;font-size:.78rem;color:#556677;letter-spacing:.08em;}
.stat-row:last-child{border-bottom:none;}
.stat-row span{color:var(--accent);font-size:1rem;}
.stat-row.gold span{color:var(--gold);text-shadow:var(--glow-gold);}

/* perk bar */
.perk-bar{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;}
.perk-tag{font-size:.65rem;padding:2px 5px;border:1px solid #1a3050;border-radius:4px;color:#4a6070;background:#0a1628;transition:all .2s;}
.perk-tag.on{border-color:var(--gold);color:var(--gold);background:#1a1000;}

.mini-canvas{display:block;margin:0 auto;}
#canvas-area{grid-area:canvas;display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;}
#gameCanvas{border:1px solid rgba(0,200,255,.2);box-shadow:0 0 40px rgba(0,200,255,.08),inset 0 0 40px rgba(0,0,0,.5);image-rendering:pixelated;display:block;touch-action:none;border-radius:4px;}

.ctrl-card{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:12px 14px;font-size:.6rem;color:#556677;line-height:2;letter-spacing:.06em;}
kbd{background:#0a1628;border:1px solid #1a3050;border-radius:3px;padding:1px 4px;color:#6a8899;font-family:'Share Tech Mono',monospace;font-size:.58rem;}
.side-btn{font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:.12em;padding:9px;border:1px solid var(--border);background:transparent;color:#445566;cursor:pointer;border-radius:6px;transition:all .2s;width:100%;}
.side-btn:hover{border-color:var(--accent);color:var(--accent);background:rgba(0,200,255,.04);}
.side-btn.gold-btn{border-color:rgba(255,215,0,.35);color:#aa8800;}
.side-btn.gold-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(255,215,0,.05);}

/* ── D-Pad ── */
#dpad{display:none;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:12px;align-items:center;justify-content:center;flex-direction:column;gap:4px;}
.dpad-row{display:flex;gap:4px;}
.dpad-btn{width:clamp(48px,14vw,62px);height:clamp(48px,14vw,62px);background:#0a1628;border:1px solid rgba(0,200,255,.2);border-radius:10px;color:var(--accent);font-size:clamp(1rem,4vw,1.3rem);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .08s;touch-action:manipulation;}
.dpad-btn:active{background:rgba(0,200,255,.1);box-shadow:0 0 16px rgba(0,200,255,.3);}
.dpad-center{background:var(--panel);color:#334455;font-size:clamp(.5rem,1.8vw,.6rem);letter-spacing:.06em;font-family:'Share Tech Mono',monospace;border-color:#1a3050;}
.dpad-center:active{background:rgba(0,200,255,.08);color:var(--accent);}

/* ── MOBILE ── */
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

/* ── OVERLAYS ── */
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

/* ── SHOP ── */
#shopOverlay{z-index:55;}
#shopOverlay h2{font-family:'Orbitron',sans-serif;font-size:clamp(1.1rem,3vw,1.4rem);letter-spacing:.28em;color:var(--accent);text-shadow:var(--glow-b);flex-shrink:0;}
.shop-coins{font-size:clamp(.8rem,2.5vw,.9rem);color:#7799aa;flex-shrink:0;letter-spacing:.1em;}
.shop-coins span{color:var(--gold);text-shadow:var(--glow-gold);}
.shop-scroll{overflow-y:auto;width:100%;max-width:540px;flex:1;min-height:0;}
.shop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:10px;padding:4px 2px 8px;}
.shop-item{background:#0a1628;border:1px solid #1a3050;border-radius:10px;padding:14px 16px;cursor:pointer;transition:border-color .15s,background .15s;display:flex;flex-direction:column;gap:6px;}
.shop-item:hover:not(.maxed){border-color:#2a4060;background:#0d1f38;}
.shop-item.owned{border-color:#00ffaa44;background:#031a10;}
.shop-item.active-perk{border-color:var(--gold);background:#1a1200;}
.shop-item.maxed{opacity:.45;cursor:default;}
.shop-icon{font-size:1.5rem;line-height:1;}
.shop-name{font-family:'Orbitron',sans-serif;font-size:.7rem;letter-spacing:.14em;color:var(--accent);}
.shop-desc{font-size:.6rem;color:#556677;letter-spacing:.04em;line-height:1.6;flex:1;}
.shop-footer{display:flex;align-items:center;justify-content:space-between;margin-top:2px;}
.shop-cost{font-size:.68rem;letter-spacing:.08em;color:var(--gold);}
.shop-badge{font-size:.52rem;letter-spacing:.12em;padding:2px 7px;border-radius:3px;border:1px solid;}
.shop-badge.buy{color:var(--accent);border-color:rgba(0,200,255,.3);background:rgba(0,200,255,.06);}
.shop-badge.owned{color:var(--snake);border-color:rgba(0,255,170,.3);background:rgba(0,255,170,.06);}
.shop-badge.on{color:var(--gold);border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.08);}
.shop-badge.off{color:#556677;border-color:#2a3a4a;}
.shop-badge.max{color:#556677;border-color:#2a3a4a;}
.shop-note{font-size:.58rem;color:#556677;text-align:center;max-width:500px;flex-shrink:0;letter-spacing:.06em;line-height:1.6;}
.shop-close{font-family:'Orbitron',sans-serif;font-size:.68rem;letter-spacing:.18em;padding:12px 32px;border:1px solid var(--border);background:transparent;color:#445566;cursor:pointer;border-radius:8px;transition:all .2s;flex-shrink:0;}
.shop-close:hover{border-color:var(--accent);color:var(--accent);}

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

const BODY_HTML = `
<div id="layout">
  <div id="topbar">
    <a class="top-btn" href="index.html">← ARCADE</a>
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
      <div class="stat-row gold">COINS <span id="hud-coins">0</span></div>
    </div>
    <div class="panel-card">
      <div class="card-label">PERKS</div>
      <div class="perk-bar" id="perkBar"></div>
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
    <button class="side-btn gold-btn" id="side-shop-btn">🛒 SHOP</button>
    <button class="side-btn" id="rules-btn">? HOW TO PLAY</button>
  </div>

  <!-- D-Pad -->
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
  <div class="ov-stat green" id="ov-score"  style="display:none">SCORE: <span id="ov-score-val">0</span></div>
  <div class="ov-stat"       id="ov-lines"  style="display:none">LINES: <span id="ov-lines-val">0</span></div>
  <div class="ov-stat gold"  id="ov-coins"  style="display:none">EARNED: <span id="ov-coins-val">0</span> 🪙</div>
  <button class="primary-btn" id="start-btn">PLAY</button>
  <div class="ov-btns">
    <button class="ov-btn" id="ov-shop-btn">🛒 SHOP</button>
    <button class="ov-btn" id="ov-how-btn">? HELP</button>
    <a class="ov-btn" href="index.html">← ARCADE</a>
  </div>
  <div class="rec-text" id="rec-text"></div>
</div>

<!-- Shop overlay -->
<div class="screen" id="shopOverlay">
  <h2>[ SHOP ]</h2>
  <div class="shop-coins">COINS: <span id="shopCoins">0</span> 🪙</div>
  <div class="shop-scroll">
    <div class="shop-grid" id="shopGrid"></div>
    <div class="shop-note">Upgrades are permanent · Perks can be toggled on/off before each run</div>
  </div>
  <button class="shop-close" id="shopClose">✕ CLOSE</button>
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
    <button class="menu-item" id="menu-shop">
      <span class="menu-icon">🛒</span>
      <div><div class="menu-item-name">SHOP</div><div class="menu-item-desc">Buy upgrades &amp; toggle perks</div></div>
    </button>
    <button class="menu-item" id="menu-how">
      <span class="menu-icon">❓</span>
      <div><div class="menu-item-name">HOW TO PLAY</div><div class="menu-item-desc">View the tutorial</div></div>
    </button>
    <div class="menu-divider"></div>
    <a class="menu-item" href="index.html">
      <span class="menu-icon">🕹️</span>
      <div><div class="menu-item-name">ARCADE</div><div class="menu-item-desc">Back to game selection</div></div>
    </a>
    <button class="menu-close" id="menu-close">✕ CLOSE</button>
  </div>
</div>

<div id="toast"></div>
`

const GAME_SCRIPT = `
// ═══════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════
const COLS = 10, ROWS = 20, CELL = 20;
const W = COLS * CELL, H = ROWS * CELL;

const PIECES = {
  I:{ color:'#00c8ff', glow:'#00c8ff88', shapes:[
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ]},
  O:{ color:'#ffd700', glow:'#ffd70088', shapes:[
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
  ]},
  T:{ color:'#bb44ff', glow:'#bb44ff88', shapes:[
    [[0,1,0],[1,1,1],[0,0,0]],[[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],[[0,1,0],[1,1,0],[0,1,0]],
  ]},
  S:{ color:'#00ffaa', glow:'#00ffaa88', shapes:[
    [[0,1,1],[1,1,0],[0,0,0]],[[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],[[1,0,0],[1,1,0],[0,1,0]],
  ]},
  Z:{ color:'#ff2d6b', glow:'#ff2d6b88', shapes:[
    [[1,1,0],[0,1,1],[0,0,0]],[[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],[[0,1,0],[1,1,0],[1,0,0]],
  ]},
  J:{ color:'#4488ff', glow:'#4488ff88', shapes:[
    [[1,0,0],[1,1,1],[0,0,0]],[[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],[[0,1,0],[0,1,0],[1,1,0]],
  ]},
  L:{ color:'#ff8800', glow:'#ff880088', shapes:[
    [[0,0,1],[1,1,1],[0,0,0]],[[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],[[1,1,0],[0,1,0],[0,1,0]],
  ]},
};

const KICKS = {
  default:[
    [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  ],
  I:[
    [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
    [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  ],
};

const PIECE_KEYS   = Object.keys(PIECES);
const LINE_SCORES  = [0, 100, 300, 500, 800];
const BASE_SPEED   = 800;
const MIN_SPEED    = 60;
const LOCK_DELAY   = 500; // ms for sticky-piece perk

// ── Shop items ────────────────────────────────────────
const ITEMS = [
  { id:'scoreBoost', type:'upgrade', icon:'✦', name:'SCORE BOOST',
    desc:'Permanently increases all line-clear points.',
    levels:[{cost:40,label:'Lv1 · +25%'},{cost:85,label:'Lv2 · +60%'},{cost:150,label:'Lv3 · +100%'}] },
  { id:'speedCap', type:'upgrade', icon:'⚡', name:'SPEED LIMIT',
    desc:'Permanently caps maximum fall speed so high levels stay manageable.',
    levels:[{cost:30,label:'Lv1 · Cap 200ms'},{cost:65,label:'Lv2 · Cap 140ms'},{cost:110,label:'Lv3 · Cap 100ms'}] },
  { id:'doubleDown', type:'perk', icon:'🎯', name:'DOUBLE DOWN',  cost:50,  desc:'First Tetris (4-line clear) this run scores 2×.' },
  { id:'slowStart',  type:'perk', icon:'🐢', name:'SLOW START',   cost:40,  desc:'Levels 1–4 fall 40% slower.' },
  { id:'coinRush',   type:'perk', icon:'🪙', name:'COIN RUSH',    cost:35,  desc:'Earn double coins this run.' },
  { id:'stickyPiece',type:'perk', icon:'⏳', name:'STICKY PIECE', cost:60,  desc:'Pieces linger on the surface before locking.' },
  { id:'b2bBonus',   type:'perk', icon:'🔥', name:'B2B BONUS',    cost:80,  desc:'Consecutive Tetrises each earn an extra +50%.' },
  { id:'extraHold',  type:'perk', icon:'📦', name:'EXTRA HOLD',   cost:70,  desc:'Hold slot can be swapped twice per piece.' },
];

function scoreMult()  { return [1, 1.25, 1.6, 2][upgrades.scoreBoost || 0]; }
function speedCapMs() { return [MIN_SPEED, 200, 140, 100][upgrades.speedCap || 0]; }

// ═══════════════════════════════════════════════════════
//  PERSISTENT STATE
// ═══════════════════════════════════════════════════════
let totalCoins  = parseInt(localStorage.getItem('tetrisCoins')    || '0');
let highscore   = parseInt(localStorage.getItem('tetrisHigh')     || '0');
const upgrades  = JSON.parse(localStorage.getItem('tetrisUpgrades') || '{}');
const activePerks = new Set(JSON.parse(localStorage.getItem('tetrisPerks') || '[]'));

function save() {
  localStorage.setItem('tetrisCoins',    String(totalCoins));
  localStorage.setItem('tetrisHigh',     String(highscore));
  localStorage.setItem('tetrisUpgrades', JSON.stringify(upgrades));
  localStorage.setItem('tetrisPerks',    JSON.stringify([...activePerks]));
}

// ═══════════════════════════════════════════════════════
//  CANVAS ELEMENTS
// ═══════════════════════════════════════════════════════
const canvas     = document.getElementById('gameCanvas');
const ctx        = canvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const hctx       = holdCanvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nctx       = nextCanvas.getContext('2d');

// ── Run-time game state ──────────────────────────────
let board, piece, nextQueue, holdPiece, holdUsed, holdCount;
let score, level, lines, coinsThisRun;
let gameOver, paused;
let lastDrop, animFrame;
let lockTimer = null;   // for sticky-piece perk
let b2bActive = false;  // for b2b-bonus perk
let doubleDownUsed = false;

// ── Canvas resize ─────────────────────────────────────
function resizeCanvas() {
  const area = document.getElementById('canvas-area');
  const maxH = area.clientHeight || window.innerHeight * 0.65;
  const maxW = area.clientWidth  || window.innerWidth  * 0.5;
  const scale = Math.max(1, Math.floor(Math.min(maxW / W, maxH / H)));
  canvas.style.width  = (W * scale) + 'px';
  canvas.style.height = (H * scale) + 'px';
}
window.addEventListener('resize', () => { resizeCanvas(); if (gameOver || paused) drawAll(); });
window.addEventListener('orientationchange', () => setTimeout(() => { resizeCanvas(); drawAll(); }, 250));

// ═══════════════════════════════════════════════════════
//  PIECE HELPERS
// ═══════════════════════════════════════════════════════
function randomBag() {
  const bag = [...PIECE_KEYS];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

let bag = [];
function nextFromBag() {
  if (!bag.length) bag = randomBag();
  return bag.shift();
}

function newPiece(key) {
  return { key, rot: 0, color: PIECES[key].color, glow: PIECES[key].glow,
    x: 3, y: key === 'I' ? -1 : 0 };
}

function shape(p) {
  const s = PIECES[p.key].shapes;
  return s[((p.rot % s.length) + s.length) % s.length];
}

function valid(p, dx, dy, rot) {
  const r   = rot !== undefined ? rot : p.rot;
  const pcs = PIECES[p.key].shapes;
  const s   = pcs[((r % pcs.length) + pcs.length) % pcs.length];
  for (let row = 0; row < s.length; row++) {
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const nx = p.x + col + dx, ny = p.y + row + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function rotate(cw) {
  const newRot = (piece.rot + (cw ? 1 : -1) + 4) % 4;
  const kicks  = piece.key === 'I' ? KICKS.I : KICKS.default;
  const kickSet = cw ? kicks[piece.rot % 4] : kicks[newRot % 4].map(([x,y]) => [-x,-y]);
  for (const [kx, ky] of kickSet) {
    if (valid(piece, kx, ky, newRot)) {
      piece.rot = newRot; piece.x += kx; piece.y += ky;
      cancelLockTimer();
      return;
    }
  }
}

function spawnNext() {
  while (nextQueue.length < 5) nextQueue.push(nextFromBag());
  piece = newPiece(nextQueue.shift());
  holdUsed  = false;
  holdCount = 0;
  if (!valid(piece, 0, 0)) { endGame(); }
}

function hardDrop() {
  cancelLockTimer();
  let dy = 0;
  while (valid(piece, 0, dy + 1)) dy++;
  piece.y += dy;
  score += dy * 2 * level;
  lock();
}

function softDrop() {
  if (valid(piece, 0, 1)) { piece.y++; score += level; cancelLockTimer(); }
  else scheduleOrLock();
}

// ── Lock-delay (sticky piece perk) ───────────────────
function cancelLockTimer() {
  if (lockTimer !== null) { clearTimeout(lockTimer); lockTimer = null; }
}

function scheduleOrLock() {
  if (activePerks.has('stickyPiece') && lockTimer === null) {
    lockTimer = setTimeout(() => { lockTimer = null; lock(); }, LOCK_DELAY);
  } else if (!activePerks.has('stickyPiece')) {
    lock();
  }
}

function lock() {
  cancelLockTimer();
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
  if (!full.length) { b2bActive = false; return; }

  full.forEach(r => { for (let c = 0; c < COLS; c++) { if (board[r][c]) board[r][c].flash = true; } });
  drawAll();

  setTimeout(() => {
    for (let i = full.length - 1; i >= 0; i--) {
      board.splice(full[i], 1);
      board.unshift(Array(COLS).fill(null));
    }

    let base = LINE_SCORES[full.length];

    // Score boost upgrade
    base = Math.round(base * scoreMult());

    // Double-down perk: first Tetris 2×
    if (full.length === 4 && activePerks.has('doubleDown') && !doubleDownUsed) {
      base *= 2; doubleDownUsed = true;
      showToast('🎯 DOUBLE DOWN! ×' + base + ' pts');
    }
    // B2B perk: consecutive Tetrises +50%
    else if (full.length === 4 && activePerks.has('b2bBonus') && b2bActive) {
      base = Math.round(base * 1.5);
      showToast('🔥 B2B! ×' + base + ' pts');
    } else if (full.length === 4) {
      showToast('✦ TETRIS! +' + (base * level) + ' pts');
    } else if (full.length === 3) {
      showToast('▲ TRIPLE! +' + (base * level) + ' pts');
    }

    b2bActive = (full.length === 4); // only keep b2b streak on Tetrises

    score += base * level;
    lines += full.length;

    // Coins: 1 per line, +3 bonus for Tetris
    const coinEarned = full.length + (full.length === 4 ? 3 : 0);
    const coinsGained = coinEarned * (activePerks.has('coinRush') ? 2 : 1);
    coinsThisRun += coinsGained;
    totalCoins   += coinsGained;

    if (score > highscore) { highscore = score; }
    level = Math.floor(lines / 10) + 1;

    updateHud();
    drawAll();
    resetDrop();
    save();
  }, 120);
}

function hold() {
  const maxHolds = activePerks.has('extraHold') ? 2 : 1;
  if (holdCount >= maxHolds) return;
  holdCount++;
  holdUsed = true;
  const key = piece.key;
  if (holdPiece) {
    const prev = holdPiece; holdPiece = key;
    piece = newPiece(prev);
  } else {
    holdPiece = key; spawnNext();
  }
  cancelLockTimer();
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
function drawBlock(c, x, y, color, glow, alpha, flash) {
  alpha = alpha ?? 1;
  const px = x * CELL, py = y * CELL;
  c.save();
  c.globalAlpha = alpha;
  c.shadowColor = flash ? '#ffffff' : (glow || color);
  c.shadowBlur  = flash ? 24 : 10;
  c.fillStyle   = flash ? '#ffffff' : color;
  c.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
  c.fillStyle = 'rgba(255,255,255,.18)';
  c.fillRect(px + 2, py + 2, CELL - 6, 4);
  c.restore();
}

function drawBoard() {
  ctx.fillStyle = '#030810'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#0a1628'; ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (cell) drawBlock(ctx, c, r, cell.color, cell.glow, 1, cell.flash);
    }
}

function drawGhost() {
  if (!piece) return;
  const gy = ghostY(), s = shape(piece);
  ctx.save(); ctx.globalAlpha = 0.18;
  for (let row = 0; row < s.length; row++)
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const ny = gy + row;
      if (ny < 0) continue;
      ctx.fillStyle = piece.color;
      ctx.fillRect((piece.x+col)*CELL+1, ny*CELL+1, CELL-2, CELL-2);
    }
  ctx.restore();
}

function drawPiece() {
  if (!piece) return;
  const s = shape(piece);
  for (let row = 0; row < s.length; row++)
    for (let col = 0; col < s[row].length; col++) {
      if (!s[row][col]) continue;
      const ny = piece.y + row; if (ny < 0) continue;
      drawBlock(ctx, piece.x + col, ny, piece.color, piece.glow);
    }
}

function drawMini(mctx, key, cw, ch) {
  mctx.fillStyle = '#030810'; mctx.fillRect(0, 0, cw, ch);
  if (!key) return;
  const p = PIECES[key], s = p.shapes[0];
  const rows = s.length, cols = s[0].length;
  const cs  = Math.min(Math.floor(cw/(cols+1)), Math.floor(ch/(rows+1)));
  const ox  = Math.floor((cw - cols*cs) / 2);
  const oy  = Math.floor((ch - rows*cs) / 2);
  mctx.save(); mctx.shadowColor = p.glow; mctx.shadowBlur = 8;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (!s[r][c]) continue;
      mctx.fillStyle = p.color;
      mctx.fillRect(ox+c*cs+1, oy+r*cs+1, cs-2, cs-2);
      mctx.fillStyle = 'rgba(255,255,255,.18)';
      mctx.fillRect(ox+c*cs+2, oy+r*cs+2, cs-4, 3);
    }
  mctx.restore();
}

function drawNextQueue() {
  nctx.fillStyle = '#030810'; nctx.fillRect(0, 0, 100, 200);
  const slotH = 40;
  nextQueue.slice(0, 5).forEach((key, i) => {
    const p = PIECES[key], s = p.shapes[0];
    const rows = s.length, cols = s[0].length;
    const cs  = Math.min(Math.floor(90/cols), Math.floor((slotH-4)/rows));
    const ox  = Math.floor((100 - cols*cs) / 2);
    const oy  = i*slotH + Math.floor((slotH - rows*cs) / 2);
    nctx.save(); nctx.shadowColor = p.glow; nctx.shadowBlur = 6;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        if (!s[r][c]) continue;
        nctx.fillStyle = p.color;
        nctx.fillRect(ox+c*cs+1, oy+r*cs+1, cs-2, cs-2);
      }
    nctx.restore();
  });
}

function drawPause() {
  ctx.fillStyle = 'rgba(0,200,255,.06)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = '#00c8ff'; ctx.shadowBlur = 14;
  ctx.fillStyle = '#00c8ff'; ctx.font = 'bold 18px Orbitron, monospace';
  ctx.textAlign = 'center'; ctx.fillText('PAUSE', W/2, H/2);
  ctx.restore();
}

function drawAll() {
  drawBoard();
  if (!gameOver) { drawGhost(); drawPiece(); }
  if (paused) drawPause();
  drawMini(hctx, holdPiece, 100, 80);
  drawNextQueue();
}

// ═══════════════════════════════════════════════════════
//  GAME LOOP
// ═══════════════════════════════════════════════════════
function effectiveSpeed() {
  let spd = Math.max(speedCapMs(), BASE_SPEED - (level - 1) * 65);
  if (activePerks.has('slowStart') && level <= 4) spd = Math.round(spd * 1.4);
  return spd;
}

function resetDrop() { lastDrop = performance.now(); }

function gameLoop(ts) {
  if (gameOver || paused) return;
  if (ts - lastDrop >= effectiveSpeed()) {
    lastDrop = ts;
    if (valid(piece, 0, 1)) { piece.y++; }
    else { scheduleOrLock(); }
    drawAll();
  }
  animFrame = requestAnimationFrame(gameLoop);
}

function updateHud() {
  document.getElementById('hud-score').textContent = score;
  document.getElementById('hud-best').textContent  = highscore;
  document.getElementById('hud-level').textContent = level;
  document.getElementById('hud-lines').textContent = lines;
  document.getElementById('hud-coins').textContent = totalCoins;
  renderPerkBar();
}

function renderPerkBar() {
  const bar = document.getElementById('perkBar');
  const perks = ITEMS.filter(i => i.type === 'perk');
  bar.innerHTML = perks.map(p =>
    \`<div class="perk-tag\${activePerks.has(p.id) ? ' on' : ''}">\${p.icon}</div>\`
  ).join('');
}

// ═══════════════════════════════════════════════════════
//  INIT / START / END
// ═══════════════════════════════════════════════════════
function initBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function startGame() {
  board = initBoard();
  bag   = randomBag();
  nextQueue = [];
  while (nextQueue.length < 5) nextQueue.push(nextFromBag());
  holdPiece = null; holdUsed = false; holdCount = 0;
  score = 0; level = 1; lines = 0; coinsThisRun = 0;
  b2bActive = false; doubleDownUsed = false;
  gameOver = false; paused = false;
  cancelLockTimer();

  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('ov-title').className = 'ov-title cyan';
  document.getElementById('ov-title').textContent = 'NEON TETRIS';
  document.getElementById('ov-score').style.display  = 'none';
  document.getElementById('ov-lines').style.display  = 'none';
  document.getElementById('ov-coins').style.display  = 'none';
  document.getElementById('start-btn').textContent = 'PLAY AGAIN';
  document.getElementById('rec-text').textContent  = '';

  spawnNext(); updateHud(); resizeCanvas(); drawAll();
  lastDrop  = performance.now();
  cancelAnimationFrame(animFrame);
  animFrame = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animFrame);
  cancelLockTimer();
  if (score > highscore) { highscore = score; }
  save();
  drawAll();

  document.getElementById('ov-title').className     = 'ov-title red';
  document.getElementById('ov-title').textContent   = 'GAME OVER';
  document.getElementById('ov-score').style.display = '';
  document.getElementById('ov-score-val').textContent = score;
  document.getElementById('ov-lines').style.display = '';
  document.getElementById('ov-lines-val').textContent = lines;
  document.getElementById('ov-coins').style.display = '';
  document.getElementById('ov-coins-val').textContent = coinsThisRun;
  document.getElementById('start-btn').textContent  = 'PLAY AGAIN';
  document.getElementById('rec-text').textContent   =
    score >= highscore && score > 0 ? '★ NEW RECORD! ★' : '';
  document.getElementById('main-screen').classList.add('active');
  document.getElementById('hud-coins').textContent  = totalCoins;
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) { lastDrop = performance.now(); animFrame = requestAnimationFrame(gameLoop); }
  drawAll();
}

// ═══════════════════════════════════════════════════════
//  SHOP
// ═══════════════════════════════════════════════════════
function renderShop() {
  document.getElementById('shopCoins').textContent = totalCoins;
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = '';

  ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-item';

    if (item.type === 'upgrade') {
      const lvl   = upgrades[item.id] || 0;
      const maxed = lvl >= item.levels.length;
      if (maxed) card.classList.add('maxed');

      const nextLevel = item.levels[lvl];
      const cost      = nextLevel ? nextLevel.cost : 0;
      const label     = nextLevel ? nextLevel.label : 'MAX';

      card.innerHTML = \`
        <div class="shop-icon">\${item.icon}</div>
        <div class="shop-name">\${item.name}</div>
        <div class="shop-desc">\${item.desc} <span style="color:#445566">\${label}</span></div>
        <div class="shop-footer">
          <span class="shop-cost">\${maxed ? '' : cost + ' 🪙'}</span>
          <span class="shop-badge \${maxed ? 'max' : 'buy'}">\${maxed ? 'MAX' : 'UPGRADE'}</span>
        </div>\`;

      if (!maxed) card.addEventListener('click', () => {
        if (totalCoins < cost) { showToast('Not enough coins!'); return; }
        totalCoins -= cost;
        upgrades[item.id] = (upgrades[item.id] || 0) + 1;
        save(); renderShop(); updateHud();
        showToast(item.icon + ' ' + item.name + ' upgraded!');
      });

    } else {
      const owned = ITEMS.find(i => i.id === item.id && i.type === 'perk') &&
                    (totalCoins >= 0); // always check purchased flag
      const purchased = !!localStorage.getItem('tetrisPerkBought_' + item.id);
      const isOn = activePerks.has(item.id);

      if (purchased) {
        card.classList.add(isOn ? 'active-perk' : 'owned');
      }

      card.innerHTML = \`
        <div class="shop-icon">\${item.icon}</div>
        <div class="shop-name">\${item.name}</div>
        <div class="shop-desc">\${item.desc}</div>
        <div class="shop-footer">
          <span class="shop-cost">\${purchased ? '' : item.cost + ' 🪙'}</span>
          <span class="shop-badge \${purchased ? (isOn ? 'on' : 'off') : 'buy'}">
            \${purchased ? (isOn ? 'ON ✓' : 'OFF') : 'BUY'}
          </span>
        </div>\`;

      card.addEventListener('click', () => {
        if (!purchased) {
          if (totalCoins < item.cost) { showToast('Not enough coins!'); return; }
          totalCoins -= item.cost;
          localStorage.setItem('tetrisPerkBought_' + item.id, '1');
          activePerks.add(item.id);
          save(); renderShop(); updateHud();
          showToast(item.icon + ' ' + item.name + ' unlocked!');
        } else {
          if (isOn) { activePerks.delete(item.id); showToast(item.icon + ' ' + item.name + ' OFF'); }
          else      { activePerks.add(item.id);    showToast(item.icon + ' ' + item.name + ' ON'); }
          save(); renderShop(); updateHud();
        }
      });
    }

    grid.appendChild(card);
  });
}

function openShop() {
  if (!gameOver && !paused) togglePause();
  renderShop();
  document.getElementById('shopOverlay').classList.add('active');
  document.getElementById('menu-overlay').classList.remove('active');
  document.getElementById('main-screen').classList.remove('active');
}

function closeShop() {
  document.getElementById('shopOverlay').classList.remove('active');
  if (gameOver || !piece) document.getElementById('main-screen').classList.add('active');
  else if (paused) togglePause();
}

document.getElementById('shopClose').addEventListener('click', closeShop);
document.getElementById('side-shop-btn').addEventListener('click', openShop);
document.getElementById('ov-shop-btn').addEventListener('click', openShop);
document.getElementById('menu-shop').addEventListener('click', openShop);

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
//  KEYBOARD / INPUT
// ═══════════════════════════════════════════════════════
const DAS_DELAY = 150, DAS_REPEAT = 40;
let dasDir = 0, dasTimer, dasRepeat;

function move(dx) {
  if (gameOver || paused || !piece) return;
  if (valid(piece, dx, 0)) { piece.x += dx; cancelLockTimer(); drawAll(); }
}

function startDAS(dx) {
  dasDir = dx; move(dx);
  clearTimeout(dasTimer); clearInterval(dasRepeat);
  dasTimer  = setTimeout(() => { dasRepeat = setInterval(() => move(dasDir), DAS_REPEAT); }, DAS_DELAY);
}

function stopDAS() {
  dasDir = 0; clearTimeout(dasTimer); clearInterval(dasRepeat);
}

document.addEventListener('keydown', e => {
  if (document.getElementById('tut-screen').classList.contains('active')) return;
  if (document.getElementById('shopOverlay').classList.contains('active')) return;
  if (document.getElementById('main-screen').classList.contains('active')) {
    if (e.key === 'Enter') startGame(); return;
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

// Touch swipe on canvas
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
  const dist = Math.sqrt(dx*dx+dy*dy);
  if (dist < 10 && dt < 200) { rotate(true); drawAll(); return; }
  if (dist < 12) return;
  if (Math.abs(dx) > Math.abs(dy)) { move(dx > 0 ? 1 : -1); }
  else if (dy > 40) { hardDrop(); }
  else if (dy < -20) { hold(); }
  drawAll(); e.preventDefault();
}, { passive: false });

// D-pad
document.getElementById('dp-left') .addEventListener('click', () => { move(-1); drawAll(); });
document.getElementById('dp-right').addEventListener('click', () => { move(1);  drawAll(); });
document.getElementById('dp-down') .addEventListener('click', () => { if(!gameOver&&!paused){softDrop();drawAll();} });
document.getElementById('dp-drop') .addEventListener('click', () => { if(!gameOver&&!paused){hardDrop();drawAll();} });
document.getElementById('dp-rotl') .addEventListener('click', () => { if(!gameOver&&!paused){rotate(false);drawAll();} });
document.getElementById('dp-rotr') .addEventListener('click', () => { if(!gameOver&&!paused){rotate(true);drawAll();} });
document.getElementById('dp-hold') .addEventListener('click', () => { if(!gameOver&&!paused){hold();drawAll();} });
document.getElementById('dp-pause').addEventListener('click', togglePause);

['dp-left','dp-right'].forEach(id => {
  const el = document.getElementById(id), dx = id === 'dp-left' ? -1 : 1;
  el.addEventListener('touchstart', e => { e.preventDefault(); startDAS(dx); }, { passive: false });
  el.addEventListener('touchend',   e => { e.preventDefault(); stopDAS(); },    { passive: false });
});

// ═══════════════════════════════════════════════════════
//  TUTORIAL
// ═══════════════════════════════════════════════════════
const TUT_STEPS = [
  { icon:'🧱', title:'WELCOME!',    text:'Falling tetrominoes — fit them together to clear lines and score points!' },
  { icon:'🕹️', title:'MOVEMENT',   text:'<strong>← →</strong> to move, <strong>↓</strong> soft drop, <strong>Space</strong> hard drop. On mobile use the D-Pad or swipe.' },
  { icon:'↺',   title:'ROTATION',   text:'<strong>↑</strong> or <strong>Z</strong> to rotate. Wall kicks let you slot pieces into tight gaps.' },
  { icon:'📦',  title:'HOLD',       text:'Press <strong>C</strong> to hold a piece for later. One hold per piece (unlock Extra Hold perk for two!).' },
  { icon:'✦',   title:'SCORING',    text:'1 line = 100 · 2 = 300 · 3 = 500 · <strong>TETRIS (4 lines) = 800</strong> × level. Upgrade Score Boost for more!' },
  { icon:'🛒',  title:'SHOP',       text:'Earn coins by clearing lines. Spend them in the <strong>Shop</strong> on permanent upgrades and run-enhancing perks.' },
  { icon:'🚀',  title:'READY!',     text:'Plan ahead with the NEXT queue and use the HOLD slot for clutch saves. Good luck!' },
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
//  START
// ═══════════════════════════════════════════════════════
document.getElementById('start-btn').addEventListener('click', startGame);

// ═══════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════
gameOver = true; paused = false;
board = initBoard();
resizeCanvas();
ctx.fillStyle = '#030810'; ctx.fillRect(0, 0, W, H);
ctx.strokeStyle = '#0a1628'; ctx.lineWidth = 0.5;
for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }
hctx.fillStyle = '#030810'; hctx.fillRect(0,0,100,80);
nctx.fillStyle = '#030810'; nctx.fillRect(0,0,100,200);
document.getElementById('hud-best').textContent  = highscore;
document.getElementById('hud-coins').textContent = totalCoins;
renderPerkBar();
`

export default function TetrisPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef     = useRef<HTMLStyleElement | null>(null)
  const scriptRef    = useRef<HTMLScriptElement | null>(null)
  const navigate     = useNavigate()
  const navigateRef  = useRef(navigate)
  navigateRef.current = navigate

  useEffect(() => {
    document.title = 'NEON TETRIS'

    const container = containerRef.current
    if (!container) return

    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
    styleRef.current = style

    container.innerHTML = BODY_HTML

    container.querySelectorAll<HTMLElement>('[data-nav]').forEach(el => {
      el.style.cursor = 'pointer'
      el.addEventListener('click', (e) => {
        e.preventDefault()
        navigateRef.current(el.dataset.nav ?? '/')
      })
    })

    const script = document.createElement('script')
    script.textContent = GAME_SCRIPT
    document.body.appendChild(script)
    scriptRef.current = script

    return () => {
      styleRef.current?.remove()
      scriptRef.current?.remove()
      if (containerRef.current) containerRef.current.innerHTML = ''
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
