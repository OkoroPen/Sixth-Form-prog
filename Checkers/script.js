/**
 Draughts template
 12 black pieces battle 12 white pieces to dominate the 8x8 board
*/

// TASK 2: setup the appropriate variables/constants
// TODO: Declare a variable called board
let board
// TODO: Define a constant called SQSIZE with a value of 50
const SQSIZE = 50
// TODO: Define a constant called BOARDSIZE with a value of 8
const BOARDSIZE = 8
// TODO: Define a constant called XOFFSET with a value of 40
const XOFFSET = 40
// TODO: Define a constant called YOFFSET with a value of 40
const YOFFSET = 40
// TODO: Define two variables - boardX and boardY - to store the coordinates of current grid position
let boardX, boardY

// colour arrays for board and players
let playerColours = ["", "black", "white"]
let boardColours = ["burlywood", "brown"]
// gamestate variable tracks whether a piece is selected or not
const NOTSELECTED = 0
const SELECTED = 1
let gameState = NOTSELECTED
background(120);

function setup() {
    createCanvas(windowWidth, windowHeight)
    // shape properties
    rectMode(CENTER)
    ellipseMode(CENTER)
    initGame()

    //console.log(MovePiece(board, from, to))
    //console.log(HighlightMove(board));
    //alert("+++++ You must ++++++\ncomplete TASK 2 before \nthis code will run nicely\n+++++ ++++++ ++++++")
}

function draw() {
    background('white')
    // once Task 2 (declare variables and constants at top of program) is done
    // this code will draw the board
    for (r = 0; r < BOARDSIZE; r++) {
        for (c = 0; c < BOARDSIZE; c++) {
            fill(boardColours[(r + c) % 2])
            rect(c * SQSIZE + XOFFSET, r * SQSIZE + YOFFSET, SQSIZE, SQSIZE)
        }
    }

    // TASK 4: highlight selected square
    // TODO: if gameState is SELECTED, set fill to gold and draw rect to coordinate boardX,boardY
    if (gameState === SELECTED) {
        fill('gold')
        rect(boardX * SQSIZE + XOFFSET, boardY * SQSIZE + YOFFSET, SQSIZE, SQSIZE)
    }

    // TASK 3: draw the pieces on the board - 2 nested loops to iterate the board, select the appropriate fill for each piece and draw it
    // TODO: Write a loop to iterate through the board array rows

    // TODO: Write a loop to iterate through the board array rows

    // TODO: Write a loop to iterate through the board array columns
    for (let r = 0; r < BOARDSIZE; r++) {
        for (let c = 0; c < BOARDSIZE; c++) {
            if (board[r][c] !== 0) {
                fill(playerColours[board[r][c]])
                ellipse(c * SQSIZE + XOFFSET, r * SQSIZE + YOFFSET, SQSIZE * 0.8, SQSIZE * 0.8)
            }
        }

    }
    // TODO: if the array is not 0 at that point, use the playerColours array to choose the right fill
    // and draw an ellipse at correct coordinates (use board drawing code as model for this)
    // close the inner loop
    // close the outer loop
    // TODO: Write a loop to iterate through the board array columns
    for (let c = 0; c < BOARDSIZE; c++) {
        if (boardX >= 0 && boardX <= 7 && boardY >= 0 && boardY <= 7) {
            if (board[boardY][boardX] !== 0) {
                gameState = SELECTED
            }
        }
    }

    // TODO: if the array is not 0 at that point, use the playerColours array to choose the right fill
    // and draw an ellipse at correct coordinates (use board drawing code as model for this)

    // close the inner loop

    // close the outer loop


}

function mouseClicked() {
    //  mouse coordinates to grid coordinates, note rect are being drawn centred, hence the 0.5 adjustment
    boardX = floor((mouseX - XOFFSET) / SQSIZE + 0.5)
    boardY = floor((mouseY - YOFFSET) / SQSIZE + 0.5)
    // TASK 4: use the board coordinates to highlight a piece
    // TODO: determine if the click was on the board (coordinates are in range 0-7)

    // TODO: determine if the clicked square holds a piece, if so set gameState to SELECTED
    if (gameState === SELECTED) {
        gameState = NOTSELECTED
    }

}


function initGame() {
    // TASK 3: initialise board pieces correctly
    // TODO: modify the board values to match the draughts.jpg
    // Empty square is 0, black piece is 1, white piece is 2
    // First line is done for you
    board = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ]
}
function HighlightMove(board) {
    let newBoard = JSON.parse(JSON.stringify(board));

    let directions = {
        "2": [[-1, -1], [-1, 1]],
        "1": [[1, -1], [1, -1]]
    };
    for (let r = 0; r < BOARDSIZE; r++) {
        for (let c = 0; c < board[r].length; c++) {
            let piece = board[r][c];
            if (piece = board[r][c]);
            if (piece === "1" || piece === "2") {
                for (let [dr, dc] of directions[piece]) {
                    let newr = r + dr;
                    let newc = c + dc
                    if (newBoard[newr] && newBoard[newr][newc] === " ") {
                        newBoard[newr][newc] = "blue"
                    }
                }
            }
        }
    }
    return newBoard
}
function MovePiece(board, from, to) {
    let newBoard = board.map(r => r.slice());
    let piece = newBoard[from.r][from.col];
    if (piece !== " " && newBoard[to.r][to.c] === " ") {
        newBoard[to.r][to.c] = piece;
        newBoard[from.r][from.c] = " ";
        let middleRow = (from.r + to.r) / 2
        let middleCol = (from.c + to.c) / 2
        if (Math.abs(from.r - to.r) === 2) {
            newBoard[middleRow][middleCol] = " ";
        }
    }
    return newBoard
}




