window.cellSize = 40;
window.boardSize = 15;
window.boardPath = [];
window.homePaths = {};

let started = false;
let paused = false;
let canvas;
let game;
let playerName = localStorage.getItem("playerName") || "Player 1";
let playerColor = localStorage.getItem("playerColor") || "red";


function setup() {
  const container = document.getElementById("canvas-container");
  canvas = createCanvas(window.boardSize * window.cellSize, window.boardSize * window.cellSize);
  canvas.parent(container);

  buildBoardPath();
  buildHomePaths();

  game = new Game({ onUpdate: updateUI });
  initializePlayers();


  document.getElementById("start-btn")?.addEventListener("click", () => {
    if (!started) {
      started = true;
      loop();
      game.startGame();
    }
  });

  document.getElementById("roll-dice-btn")?.addEventListener("click", () => {
    if (!started) { started = true; loop(); game.startGame(); return; }
    if (!paused && game.getCurrentPlayer().isHuman) game.rollDice();
  });

  document.getElementById("pause-btn")?.addEventListener("click", () => {
    paused = !paused;
    if (paused) noLoop();
    else loop();
  });

  document.getElementById("restart-btn")?.addEventListener("click", restartGame);

  document.getElementById("settings-btn")?.addEventListener("click", () => {
    document.getElementById("settings-menu").classList.remove("hidden");
    noLoop();
  });

  document.getElementById("save-settings")?.addEventListener("click", () => {
    document.getElementById("settings-menu").classList.add("hidden");
    loop();
  });

  noLoop(); // Game starts paused
}


function updateUI(dice) {
  const dr = document.getElementById("dice-result");
  if (dr) dr.innerText = `🎲 Dice: ${dice[0]}, ${dice[1]}`;
  const cur = game.getCurrentPlayer();
  const td = document.getElementById("turn-display");
  if (td) td.innerText = `Turn: ${cur ? cur.name : "Waiting..."}`;
}

function initializePlayers() {
  game.players = [];
  const colors = ["red", "green", "yellow", "blue"];
  const names = ["Red Bot", "Green Bot", "Yellow Bot", "Blue Bot"];
  colors.forEach((color, i) => {
    const isHuman = (color === playerColor);
    const name = isHuman ? playerName : names[i];
    const p = new Player(i, name, color, isHuman);
    p.tokens.forEach(t => t.resetToBase());
    game.addPlayer(p);
  });
}

function draw() {
  background(255);
  drawBoard();
  drawTokens();
  drawDice(game.dice[0], game.dice[1]);

  if (paused) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Paused", width / 2, height / 2);
  }
}



function drawBoard() {
  const cs = window.cellSize;
  const bs = window.boardSize;

  // Draw base grid background (no thick borders)
  noStroke();
  fill(255);
  for (let i = 0; i < bs; i++) {
    for (let j = 0; j < bs; j++) {
      rect(i * cs, j * cs, cs, cs);
    }
  }

  // Quadrants (home zones)
  fill("red"); rect(0, 0, 6 * cs, 6 * cs);
  fill("green"); rect(9 * cs, 0, 6 * cs, 6 * cs);
  fill("blue"); rect(0, 9 * cs, 6 * cs, 6 * cs);
  fill("yellow"); rect(9 * cs, 9 * cs, 6 * cs, 6 * cs);

  // Token homes
  drawTokenHoles(3 * cs, 3 * cs, "red");
  drawTokenHoles(12 * cs, 3 * cs, "green");
  drawTokenHoles(3 * cs, 12 * cs, "blue");
  drawTokenHoles(12 * cs, 12 * cs, "yellow");

  // Outline board path (exclude home zone areas)
  stroke(120);
  strokeWeight(1);
  for (const tile of window.boardPath) {
    const gridX = tile.x / cs;
    const gridY = tile.y / cs;
    const inRedHome = (gridX < 6 && gridY < 6);
    const inGreenHome = (gridX >= 9 && gridY < 6);
    const inBlueHome = (gridX < 6 && gridY >= 9);
    const inYellowHome = (gridX >= 9 && gridY >= 9);
    if (!inRedHome && !inGreenHome && !inBlueHome && !inYellowHome) {
      noFill();
      rect(tile.x, tile.y, cs, cs);
    }
  }
  drawSafeZones();
  drawCenterFinish();
  drawEntrySquares();
}


function drawTokenHoles(cx, cy, color) {
  push();
  stroke(color);
  strokeWeight(3);
  fill(255);
  const holeSize = window.cellSize * 0.1;
  const offset = window.cellSize * 0.5;
  ellipse(cx - offset, cy - offset, holeSize);
  ellipse(cx + offset, cy - offset, holeSize);
  ellipse(cx - offset, cy + offset, holeSize);
  ellipse(cx + offset, cy + offset, holeSize);
  pop();
}


function drawSafeZones() {
  const cs = window.cellSize;
  noStroke();
  // Red path
  fill("red");
  for (let i = 1; i <= 6; i++) rect(i * cs, 7 * cs, cs, cs);
  // Green path
  fill("green");
  for (let j = 1; j <= 6; j++) rect(7 * cs, j * cs, cs, cs);
  // Yellow path
  fill("yellow");
  for (let i = 13; i >= 8; i--) rect(i * cs, 7 * cs, cs, cs);

  // Blue path
  fill("blue");
  for (let j = 13; j >= 8; j--) rect(7 * cs, j * cs, cs, cs);
}

function drawCenterFinish() {
  const cs = window.cellSize;
  const left = 6 * cs, top = 6 * cs, right = 9 * cs, bottom = 9 * cs;
  const cx = (left + right) / 2, cy = (top + bottom) / 2;
  push();
  noStroke();
  fill("green"); triangle(left, top, right, top, cx, cy);
  fill("yellow"); triangle(right, top, right, bottom, cx, cy);
  fill("blue"); triangle(left, bottom, right, bottom, cx, cy);
  fill("red"); triangle(left, top, left, bottom, cx, cy);
  fill(255);
  rectMode(CENTER);
  rect(cx, cy, cs * 0.6, cs * 0.6, 6);
  pop();
}


function drawTokens() {
  if (!game || !game.players) return;
  game.players.forEach(p => {
    p.tokens.forEach(t => {
      t.updateCoordinates();
      t.draw();
    });
  });
}


function mousePressed() {
  if (!started || paused) return;
  const player = game.getCurrentPlayer();
  if (!player.isHuman) return;
  const sel = player.selectToken(mouseX, mouseY, game.validMoves);
  if (sel) {
    const token = player.tokens[sel.tokenId];
    game.moveToken(player, token, sel.steps, sel.source);
  }
}


function buildBoardPath() {
  const cs = window.cellSize;
  const p = [];

  // Red side - 
  for (let i = 0; i <= 5; i++) p.push({ x: i * cs, y: 6 * cs });
  for (let j = 5; j >= 0; j--) p.push({ x: 6 * cs, y: j * cs });

  // Green side - 
  for (let i = 7; i <= 8; i++) p.push({ x: i * cs, y: 0 });
  for (let j = 1; j <= 5; j++) p.push({ x: 8 * cs, y: j * cs });
  for (let i = 9; i <= 14; i++) p.push({ x: i * cs, y: 6 * cs });

  // Yellow side 
  for (let j = 7; j <= 8; j++) p.push({ x: 14 * cs, y: j * cs });
  for (let i = 13; i >= 9; i--) p.push({ x: i * cs, y: 8 * cs });
  for (let j = 9; j <= 14; j++) p.push({ x: 8 * cs, y: j * cs });

  // Blue side 
  for (let i = 7; i >= 6; i--) p.push({ x: i * cs, y: 14 * cs });
  for (let j = 13; j >= 9; j--) p.push({ x: 6 * cs, y: j * cs });
  for (let i = 5; i >= 0; i--) p.push({ x: i * cs, y: 8 * cs });

  // Connect back to start - up to row 7 on column 0
  p.push({ x: 0, y: 7 * cs });

  window.boardPath = p.slice(0, 52);
}

function buildHomePaths() {
  const cs = window.cellSize;
  window.homePaths = {
    red: [ {x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:5,y:7},{x:6,y:7} ],
    green: [ {x:7,y:1},{x:7,y:2},{x:7,y:3},{x:7,y:4},{x:7,y:5},{x:7,y:6} ],
    yellow: [ {x:13,y:7},{x:12,y:7},{x:11,y:7},{x:10,y:7},{x:9,y:7},{x:8,y:7} ],
    blue: [ {x:7,y:13},{x:7,y:12},{x:7,y:11},{x:7,y:10},{x:7,y:9},{x:7,y:8} ]
  };
}


function drawEntrySquares() {
  const cs = window.cellSize;
  const entries = [
    { color: 'red', x: 1 * cs, y: 6 * cs },
    { color: 'green', x: 8 * cs, y: 1 * cs },
    { color: 'yellow', x: 13 * cs, y: 8 * cs },
    { color: 'blue', x: 6 * cs, y: 13 * cs }
  ];
  push();
  strokeWeight(3);
  entries.forEach(e => {
    stroke(e.color);
    noFill();
    rect(e.x, e.y, cs, cs);
  });
  pop();
}

function drawDice(die1, die2) {
  const cs = window.cellSize;
  const diceSize = cs * 1.2;
  const startX = 6.5 * cs - diceSize - 5;
  const startY = 6.5 * cs - diceSize / 2;

  drawSingleDie(startX, startY, diceSize, die1);
  drawSingleDie(startX + diceSize + 10, startY, diceSize, die2);
}

function drawSingleDie(x, y, size, value) {
  push();
  fill(255);
  stroke(50);
  strokeWeight(2);
  rect(x, y, size, size, 6);

  fill(30);
  noStroke();
  const dotSize = size * 0.15;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const offset = size * 0.25;

  if (value === 1) {
    ellipse(cx, cy, dotSize);
  } else if (value === 2) {
    ellipse(cx - offset, cy - offset, dotSize);
    ellipse(cx + offset, cy + offset, dotSize);
  } else if (value === 3) {
    ellipse(cx - offset, cy - offset, dotSize);
    ellipse(cx, cy, dotSize);
    ellipse(cx + offset, cy + offset, dotSize);
  } else if (value === 4) {
    ellipse(cx - offset, cy - offset, dotSize);
    ellipse(cx + offset, cy - offset, dotSize);
    ellipse(cx - offset, cy + offset, dotSize);
    ellipse(cx + offset, cy + offset, dotSize);
  } else if (value === 5) {
    ellipse(cx - offset, cy - offset, dotSize);
    ellipse(cx + offset, cy - offset, dotSize);
    ellipse(cx, cy, dotSize);
    ellipse(cx - offset, cy + offset, dotSize);
    ellipse(cx + offset, cy + offset, dotSize);
  } else if (value === 6) {
    ellipse(cx - offset, cy - offset, dotSize);
    ellipse(cx + offset, cy - offset, dotSize);
    ellipse(cx - offset, cy, dotSize);
    ellipse(cx + offset, cy, dotSize);
    ellipse(cx - offset, cy + offset, dotSize);
    ellipse(cx + offset, cy + offset, dotSize);
  }
  pop();
}

function restartGame() {
  started = false;
  paused = false;
  game = new Game({ onUpdate: updateUI });
  initializePlayers();

  const dr = document.getElementById("dice-result");
  if (dr) dr.innerText = "Dice: -";
  const td = document.getElementById("turn-display");
  if (td) td.innerText = "Turn: Waiting...";
  noLoop();
}