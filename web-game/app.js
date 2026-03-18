const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart");
const pauseBtn = document.getElementById("pause");

const STORAGE_KEY = "web-game-best-score";

const state = {
  running: true,
  startedAt: performance.now(),
  lastFrameAt: performance.now(),
  score: 0,
  best: 0,
  player: { x: 120, y: 120, r: 14, vx: 0, vy: 0 },
  target: { x: 500, y: 280, s: 18 },
  keys: new Set(),
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function placeTarget() {
  const margin = 28;
  state.target.x = rand(margin, canvas.width - margin);
  state.target.y = rand(margin, canvas.height - margin);
}

function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function updateUI() {
  scoreEl.textContent = String(state.score);
  bestEl.textContent = String(state.best);
}

function setPaused(paused) {
  state.running = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  if (state.running) {
    state.lastFrameAt = performance.now();
    requestAnimationFrame(loop);
  }
}

function reset() {
  state.score = 0;
  state.startedAt = performance.now();
  state.lastFrameAt = performance.now();
  state.player.x = 120;
  state.player.y = 120;
  state.player.vx = 0;
  state.player.vy = 0;
  placeTarget();
  updateUI();
}

function handleKeys() {
  const speed = 320;
  const up = state.keys.has("ArrowUp") || state.keys.has("w");
  const down = state.keys.has("ArrowDown") || state.keys.has("s");
  const left = state.keys.has("ArrowLeft") || state.keys.has("a");
  const right = state.keys.has("ArrowRight") || state.keys.has("d");

  state.player.vx = (right ? 1 : 0) - (left ? 1 : 0);
  state.player.vy = (down ? 1 : 0) - (up ? 1 : 0);

  const len = Math.hypot(state.player.vx, state.player.vy) || 1;
  state.player.vx = (state.player.vx / len) * speed;
  state.player.vy = (state.player.vy / len) * speed;
}

function tick(dt) {
  handleKeys();
  state.player.x += state.player.vx * dt;
  state.player.y += state.player.vy * dt;

  const pad = state.player.r + 6;
  state.player.x = clamp(state.player.x, pad, canvas.width - pad);
  state.player.y = clamp(state.player.y, pad, canvas.height - pad);

  const hitRadius = state.player.r + state.target.s * 0.7;
  if (dist2(state.player.x, state.player.y, state.target.x, state.target.y) <= hitRadius * hitRadius) {
    state.score += 1;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem(STORAGE_KEY, String(state.best));
    }
    placeTarget();
    updateUI();
  }

  const elapsed = (performance.now() - state.startedAt) / 1000;
  timeEl.textContent = `${elapsed.toFixed(1)}s`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background grid
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#9fb7ff";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();

  // target
  ctx.save();
  ctx.fillStyle = "#6cf0c2";
  ctx.shadowColor = "rgba(108, 240, 194, 0.55)";
  ctx.shadowBlur = 18;
  ctx.fillRect(state.target.x - state.target.s / 2, state.target.y - state.target.s / 2, state.target.s, state.target.s);
  ctx.restore();

  // player
  ctx.save();
  const g = ctx.createRadialGradient(state.player.x - 6, state.player.y - 6, 2, state.player.x, state.player.y, state.player.r + 10);
  g.addColorStop(0, "#7aa7ff");
  g.addColorStop(1, "#3b62ff");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // score pop
  ctx.save();
  ctx.fillStyle = "rgba(234, 241, 255, 0.85)";
  ctx.font = "600 14px ui-sans-serif, system-ui";
  ctx.fillText(`Score: ${state.score}`, 16, 24);
  ctx.restore();
}

function loop(now) {
  if (!state.running) return;
  const dt = Math.min(0.04, (now - state.lastFrameAt) / 1000);
  state.lastFrameAt = now;
  tick(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(k)) {
    state.keys.add(k);
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  state.keys.delete(k);
});

restartBtn.addEventListener("click", () => reset());
pauseBtn.addEventListener("click", () => setPaused(state.running));

try {
  const best = Number(localStorage.getItem(STORAGE_KEY) || "0");
  state.best = Number.isFinite(best) ? best : 0;
} catch {
  state.best = 0;
}

reset();
requestAnimationFrame(loop);

