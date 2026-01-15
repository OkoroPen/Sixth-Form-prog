/**
 Binary puzzle template
*/
// TASK 2: Declare the required constants and variables
const BOARDSIZE = 10;
const SQSIZE = 50;
const XOFFSET = 30
const YOFFSET = 30
var puzzle
var boardX
var boardY
function setup() {
    createCanvas(windowWidth, windowHeight)
    //alert("+++++ You must ++++++\ncomplete TASK 2 before \nthis code will run nicely\n+++++ ++++++ ++++++")//
    //place a button below where the board will be drawn//
    createButton(windowWidth, windowHeight)
    textSize(SQSIZE)
    textAlign(LEFT, TOP)
    initGame()
    background(200)

}
function feature(l) {
    alert(`Unlock this feature by upgrading to ${l} level`)

}
function draw() {
    background('white')
    stroke('black')
    // once Task 2 (declare variables and constants at top of program) is done
    // this code will draw the board
    for (let a = 0; a <= BOARDSIZE; a++) {
        // draw  vertical lines
        line(a * SQSIZE + XOFFSET, YOFFSET, a * SQSIZE + XOFFSET, BOARDSIZE * SQSIZE + YOFFSET)
        // draw horizontal lines
        line(XOFFSET, a * SQSIZE + YOFFSET, BOARDSIZE * SQSIZE + XOFFSET, a * SQSIZE + YOFFSET)
    }
    //TASK 5: highlight the square of the puzzle that the mouse is over
    // TODO: if boardX and boardY are both with the right range 0 to BOARDSIZE-1 draw a square of size SQSIZE (using the rect function)
    if (boardX >= 0 && boardX <= BOARDSIZE - 1 && boardY >= 0 && boardY <= BOARDSIZE - 1) {
        fill('gold')
        rect(boardX * SQSIZE + XOFFSET, boardY * SQSIZE + YOFFSET, SQSIZE, SQSIZE)
    }
    fill('black')
    // }//
    // It is your choice of stroke and fill colours for the highlight
    // Set stroke and fill back to original values otherwise whole board will be drawn in those colours
    // TASK 3: write code that will iterate through the puzzle array and display the numbers correctly//
    for (let y = 0; y < BOARDSIZE; y++) {
        for (let x = 0; x < BOARDSIZE; x++) {
            if (puzzle[y][x] !== null) {
                text(puzzle[y][x], XOFFSET + SQSIZE * x, YOFFSET + SQSIZE * y
                )
            }
        }
    }
    // TODO: start a for loop that deals with rows (0 to BOARDSIZE-1)
    // TODO: start a for loop that deals with columns (0 to BOARDSIZE-1)
    // TODO: if the puzzle location is not null use text() to display the array value at the right place
    // text() takes 3 parameters e.g. text("BOB",500,200) would display BOB at x coordinate 500 , and y coordinate 200
    // to get the correct x coordinate multiply the column number by SQSIZE and add XOFFSET, do the same for the rows to get the y coordinate
    // close inner loop
    // close outer loop
}
function mouseMoved() {
    // TASK 4: when the mouse is clicked need to work out the row and column of the puzzle
    // TODO: work out the boardY coordinate - boardX is done for you
    boardX = floor((mouseX - XOFFSET) / SQSIZE)
    boardY = floor((mouseY - YOFFSET) / SQSIZE)
}
function keyPressed() {
    // TASK 6: pressing a 1 or a 0 edits the puzzle
    // TODO: if 0 or 1 was pressed (note, the most recently pressed key is stored in the 'key' variable) assign it to the currently selected puzzle square
    if ((key) == "0") puzzle[boardY][boardX] = 0
    if ((key) == "1") puzzle[boardY][boardX] = 1
}
function initGame() {
    // TASK 2: initialise puzzle correctly
    // TODO: modify the puzzle values to match the Binary Puzzle.jpg
    // Empty square is blank, pre-filled either 0 or 1
    // First line is done for you
    puzzle = [
        [, , 0, , , 0, , , , 0],
        [1, 1, , , , , , , ,],
        [, , , , 1, , , , 1,],
        [, , 0, , 1, , 0, , , 0],
        [1, , , , , , , 1, ,],
        [, 0, , , 1, , 1, , ,],
        [, , , , 1, , , 0, ,],
        [, 0, , , , 0, , , 1, 0],
        [, 1, , 0, , , , , ,],
        [, , , , , , 1, , 1,]
    ];
}
// Toggle dark mode
const toggle = document.getElementById('toggle');
const body = document.querySelector('body');

toggle.addEventListener('click', function () {
    this.classList.toggle('bi-moon');
    if (this.classList.contains('bi-moon')) {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
});
