const canvas = document.getElementById("riftCanvas");
const ctx = canvas.getContext("2d");
const cards = Array.from(document.querySelectorAll(".combat-card"));
const intentName = document.getElementById("intentName");
const intentHint = document.getElementById("intentHint");

const intents = [
  {
    name: "煞影突刺",
    hint: "红招：不可格挡，踏云步窗口即将开启",
    card: "踏云步",
  },
  {
    name: "符刃三连",
    hint: "普通连段：照影格可完美反震",
    card: "照影格",
  },
  {
    name: "血咒蓄力",
    hint: "可破招：听风斩能抢断前摇",
    card: "听风斩",
  },
  {
    name: "纸傀压阵",
    hint: "压迫招式：凝神诀可稳住补牌节奏",
    card: "凝神诀",
  },
];

let width = 0;
let height = 0;
let dpr = 1;
let activeIntent = 0;

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  width = Math.max(1, Math.floor(rect.width));
  height = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawMountainLayer(time, color, yBase, amplitude, speed) {
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width + 80; x += 80) {
    const y = yBase + Math.sin(x * 0.009 + time * speed) * amplitude + Math.cos(x * 0.017) * amplitude * 0.45;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawRift(time) {
  const centerX = width * 0.66;
  const top = height * 0.1;
  const bottom = height * 0.86;

  ctx.save();
  ctx.translate(centerX, 0);
  ctx.beginPath();
  ctx.moveTo(-18 + Math.sin(time * 1.4) * 8, top);
  ctx.bezierCurveTo(42, height * 0.24, -56, height * 0.42, 28, height * 0.58);
  ctx.bezierCurveTo(-38, height * 0.7, 26, height * 0.78, -16, bottom);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(217, 74, 43, 0.92)";
  ctx.shadowColor = "rgba(217, 74, 43, 0.8)";
  ctx.shadowBlur = 26;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(20, top + 42);
  ctx.bezierCurveTo(-30, height * 0.31, 60, height * 0.47, -18, height * 0.63);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(104, 216, 207, 0.72)";
  ctx.shadowColor = "rgba(104, 216, 207, 0.55)";
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.restore();
}

function drawTalismans(time) {
  for (let i = 0; i < 28; i += 1) {
    const drift = (time * 28 + i * 87) % (width + 160);
    const x = width - drift + Math.sin(time + i) * 18;
    const y = 90 + ((i * 73) % Math.max(160, height - 160));
    const rotate = Math.sin(time * 0.7 + i) * 0.4;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate);
    ctx.globalAlpha = 0.18 + (i % 4) * 0.05;
    ctx.fillStyle = i % 3 === 0 ? "#d8be82" : "#a83224";
    ctx.fillRect(-12, -22, 24, 44);
    ctx.strokeStyle = "rgba(16, 13, 11, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 15);
    ctx.moveTo(-7, -2);
    ctx.lineTo(7, -2);
    ctx.stroke();
    ctx.restore();
  }
}

function render(timeMs) {
  const time = timeMs / 1000;
  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#160f0c");
  bg.addColorStop(0.48, "#23120e");
  bg.addColorStop(1, "#0e0b09");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawMountainLayer(time, "rgba(18, 98, 79, 0.22)", height * 0.55, 46, 0.18);
  drawMountainLayer(time, "rgba(143, 29, 32, 0.2)", height * 0.68, 34, -0.16);
  drawMountainLayer(time, "rgba(8, 6, 5, 0.66)", height * 0.8, 24, 0.12);
  drawTalismans(time);
  drawRift(time);

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "#d4a047";
  for (let i = 0; i < 7; i += 1) {
    const y = height * (0.22 + i * 0.08) + Math.sin(time + i) * 8;
    ctx.beginPath();
    ctx.moveTo(width * 0.48 - i * 16, y);
    ctx.lineTo(width * 0.92, y + 18);
    ctx.stroke();
  }
  ctx.restore();

  requestAnimationFrame(render);
}

function setIntent(index) {
  activeIntent = index % intents.length;
  const active = intents[activeIntent];
  intentName.textContent = active.name;
  intentHint.textContent = active.hint;

  cards.forEach((card) => {
    card.classList.toggle("active", card.dataset.card === active.card);
  });
}

function setupPhaseSwitch() {
  const buttons = Array.from(document.querySelectorAll(".phase-button"));
  const panels = Array.from(document.querySelectorAll("[data-phase-panel]"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const phase = button.dataset.phase;
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.phasePanel === phase);
      });
    });
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(render);
setupPhaseSwitch();
setInterval(() => setIntent(activeIntent + 1), 2800);
