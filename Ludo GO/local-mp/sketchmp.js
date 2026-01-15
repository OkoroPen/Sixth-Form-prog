let cellSize = 40;
let boardSize = 15;
let canvas, game, started = false, paused = false;
let playerName = localStorage.getItem("playerName") || "Player 1";
let playerColor = localStorage.getItem("playerColor") || "red";

function setup() {
  const container = document.getElementById("canvas-container");
  canvas = createCanvas(boardSize * cellSize, boardSize * cellSize);
  canvas.parent(container);

  buildBoardPath();
  buildHomePaths();

  game = new Game({ onUpdate: updateUI });
  initializePlayers();

  document.getElementById("start-btn")?.addEventListener("click", startGameHandler);
  document.getElementById("roll-dice-btn")?.addEventListener("click", rollDiceHandler);
  document.getElementById("pause-btn")?.addEventListener("click", pauseHandler);
  document.getElementById("restart-btn")?.addEventListener("click", restartGame);
  document.getElementById("settings-btn")?.addEventListener("click", showSettings);
  document.getElementById("save-settings")?.addEventListener("click", hideSettings);

  noLoop();
}

function startGameHandler() {
  if (!started) { started = true; loop(); game.startGame(); }
}

function rollDiceHandler() {
  if (!started) { started = true; loop(); game.startGame(); return; }
  if (!paused && game.getCurrentPlayer().isHuman) game.rollDice();
}

function pauseHandler() {
  paused = !paused;
  if (paused) noLoop(); else loop();
}

function showSettings() {
  document.getElementById("settings-menu").classList.remove("hidden");
  noLoop();
}

function hideSettings() {
  document.getElementById("settings-menu").classList.add("hidden");
  loop();
}

function updateUI(dice) {
  document.getElementById("dice-result").innerText = `🎲 Dice: ${dice[0]}, ${dice[1]}`;
  const cur = game.getCurrentPlayer();
  document.getElementById("turn-display").innerText = `Turn: ${cur ? cur.name : "Waiting..."}`;
}

function draw() {
  background(255);
  drawBoard();
  drawTokens();
  if (paused) {
    fill(0,0,0,150);
    rect(0,0,width,height);
    fill(255);
    textSize(28);
    textAlign(CENTER,CENTER);
    text("Paused", width/2, height/2);
  }
}
