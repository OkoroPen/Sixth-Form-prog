let board;
const SQSIZE = 50;        // Square size
const BOARDSIZE = 8;      // Size of the board (8x8)
const XOFFSET = 40;       // X offset for drawing
const YOFFSET = 40;       // Y offset for drawing
let boardX, boardY;       // Coordinates of the current square
let playerColours = ["", "black", "white"];  // Player colors (black: 1, white: 2)
let boardColours = ["burlywood", "brown"];  // Board colors for alternating squares
const NOTSELECTED = 0;
const SELECTED = 1;
let gameState = NOTSELECTED;

function initGame() {
    // Initialize the board with pieces
    board = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ];
}
function draw() {
    background('white');

    // Draw the board
    for (r = 0; r < BOARDSIZE; r++) {
        for (c = 0; c < BOARDSIZE; c++) {
            fill(boardColours[(r + c) % 2]);
            rect(c * SQSIZE + XOFFSET, r * SQSIZE + YOFFSET, SQSIZE, SQSIZE);
        }
    }

    // Highlight the selected square if a piece is selected
    if (gameState === SELECTED) {
        fill('gold');
        rect(boardX * SQSIZE + XOFFSET, boardY * SQSIZE + YOFFSET, SQSIZE, SQSIZE);
    }

    // Draw pieces on the board
    for (let r = 0; r < BOARDSIZE; r++) {
        for (let c = 0; c < BOARDSIZE; c++) {
            if (board[r][c] !== 0) {
                fill(playerColours[board[r][c]]);
                ellipse(c * SQSIZE + XOFFSET, r * SQSIZE + YOFFSET, SQSIZE * 0.8, SQSIZE * 0.8);
            }
        }
    }
}
function mouseClicked() {
    // Convert mouse coordinates to grid coordinates
    boardX = floor((mouseX - XOFFSET) / SQSIZE + 0.5);
    boardY = floor((mouseY - YOFFSET) / SQSIZE + 0.5);

    // Check if the click was on a valid square (0-7)
    if (boardX >= 0 && boardX < BOARDSIZE && boardY >= 0 && boardY < BOARDSIZE) {
        // If a piece is already selected, deselect it
        if (gameState === SELECTED) {
            gameState = NOTSELECTED;
        }

        // If there is a piece on the clicked square, select it
        if (board[boardY][boardX] !== 0) {
            gameState = SELECTED;
        }
    }
}
function HighlightMove(board, r, c) {
    let piece = board[r][c];
    let newBoard = board.map(row => row.slice()); // Create a copy of the board
    let directions = {
        1: [[-1, -1], [-1, 1]], // Black pieces (1)
        2: [[1, -1], [1, 1]]     // White pieces (2)
    };

    if (piece === 1 || piece === 2) {
        for (let [dr, dc] of directions[piece]) {
            let newr = r + dr;
            let newc = c + dc;
            // Check if the new position is within bounds and is empty
            if (newr >= 0 && newr < BOARDSIZE && newc >= 0 && newc < BOARDSIZE && board[newr][newc] === 0) {
                newBoard[newr][newc] = 3; // Mark as a possible move (3)
            }
        }
    }

    return newBoard;
}
function MovePiece(board, from, to) {
    let newBoard = board.map(row => row.slice());  // Make a copy of the board
    let piece = newBoard[from.r][from.c];

    if (piece !== 0 && newBoard[to.r][to.c] === 0) {  // If the destination is empty
        newBoard[to.r][to.c] = piece;  // Move the piece
        newBoard[from.r][from.c] = 0;  // Empty the old square
    }

    return newBoard;
}
