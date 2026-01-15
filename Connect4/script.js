let cols = 7;
let rows = 6;
let board;
let currentPlayer;
const cellSize = 100;
let gameOver = false;

function setup() {
    createCanvas(cols * cellSize, rows * cellSize);
    board = Array(rows).fill().map(() => Array(cols).fill(0));
    currentPlayer = 1;
}

function draw() {
    background(0);
    drawBoard();
    if (gameOver) {
        noLoop();
        let winner = currentPlayer === 1 ? "Yellow" : "Red";
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text(winner + " Wins!", width / 2, height / 2);
    }
}

function mousePressed() {
    if (gameOver) return;

    let col = floor(mouseX / cellSize);
    if (col < 0 || col >= cols) return;

    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            board[r][col] = currentPlayer;

            // Save current player before switching
            let currentPlayerTemp = currentPlayer;

            if (checkWin(r, col)) {
                gameOver = true;
                // Declare winner based on the saved current player
                let winner = currentPlayerTemp === 1 ? "Yellow" : "Red";
                setTimeout(() => {
                    fill(255);
                    textSize(48);
                    textAlign(CENTER, CENTER);
                    text(winner + " Wins!", width / 2, height / 2);
                }, 100);
            } else {
                currentPlayer = 3 - currentPlayer; // Switch players
            }
            break;
        }
    }
}

function drawBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            stroke(0);
            fill(50, 50, 200);
            rect(c * cellSize, r * cellSize, cellSize, cellSize);
            let piece = board[r][c];
            if (piece === 1) {
                fill(255, 255, 0); // Yellow for Player 1
            } else if (piece === 2) {
                fill(255, 0, 0); // Red for Player 2
            } else {
                fill(255); // Empty space
            }
            ellipse(
                c * cellSize + cellSize / 2,
                r * cellSize + cellSize / 2,
                cellSize * 0.8
            );
        }
    }
}

function resetBoard() {
    board = [];
    for (let i = 0; i < rows; i++) {
        board.push(new Array(cols).fill(0));
    }
    currentPlayer = 1;
    loop();
}

function checkWin(row, col) {
    return (
        countInDirection(row, col, 1, 0) + countInDirection(row, col, -1, 0) >= 3 ||
        countInDirection(row, col, 0, 1) + countInDirection(row, col, 0, -1) >= 3 ||
        countInDirection(row, col, 1, 1) + countInDirection(row, col, -1, -1) >= 3 ||
        countInDirection(row, col, 1, -1) + countInDirection(row, col, -1, 1) >= 3
    );
}

function countInDirection(r, c, dr, dc) {
    let player = board[r][c];
    let count = 0;
    for (let i = 1; i < 4; i++) {
        let nr = r + dr * i;
        let nc = c + dc * i;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
        if (board[nr][nc] === player) count++;
        else break;
    }
    return count;
}
