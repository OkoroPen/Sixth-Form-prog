const gridSize = 10;
const cellSize = 40;
let playerGuesses;
let shipBoard;
let ships = [
    { size: 5, hits: 0 },
    { size: 4, hits: 0 },
    { size: 3, hits: 0 },
    { size: 2, hits: 0 }
];
let hits = 0;
let gameOver = false;
let totalHitsNeeded = 0;

function setup() {
    createCanvas(gridSize * cellSize, gridSize * cellSize);
    playerGuesses = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    shipBoard = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    //placeAllShips();
}

function draw() {
    background(220);
    drawGrid();
    if (gameOver) {
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("You sank all ships", width / 2, height / 2);
        noLoop();
    }
}

function drawGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            stroke(0);
            fill(200);
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
            if (playerGuesses[y][x] === 1) {
                fill(0);
                ellipse(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 10);
            } else if (playerGuesses[y][x] === 2) {
                fill(255, 0, 0);
                ellipse(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 20);
            }
        }
    }
}

function mousePressed() {
    if (gameOver) return;

    let x = floor(mouseX / cellSize);
    let y = floor(mouseY / cellSize);
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (playerGuesses[y][x] !== 0) return;

    if (shipBoard[y][x] === 1) {
        playerGuesses[y][x] = 2;
        hits++;
        if (hits >= totalHitsNeeded) {
            gameOver = true;
        }
    } else {
        playerGuesses[y][x] = 1;
    }
}

function canPlaceShip(x, y, dir, size) {
    if (dir === 'H') {
        if (x + size > gridSize) return false;
        for (let i = 0; i < size; i++) {
            if (shipBoard[y][x + i] === 1) return false;
        }
    } else {
        if (y + size > gridSize) return false;
        for (let i = 0; i < size; i++) {
            if (shipBoard[y + i][x] === 1) return false;
        }
    }
    return true;
}
