const col = 10
const rows = 10
const cellSize = 50;

let maze = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 0, 0],
];
let player = { x: 0, y: 0 };
let goal = { x: 9, y: 0 };

function setup() {
    createCanvas(col * cellSize, rows * cellSize);
}
function draw() {
    background(200);
    drawMaze();
    drawPlayer();
}

function drawMaze() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < col; x++) {
            let val = maze[y][x];
            if (val === 1) {
                fill(0);
            } else if (x === goal.x && y === goal.y) {
                fill(0, 255, 0);
            } else {
                fill(255);
            }
            stroke(150);
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}
function keyPressed() {
    // use wasd to navigate
    switch (key) {
        case "w":
            player.up();
            break;
        case "d":
            player.right();
            break;
        // TASK 6: complete the player movement code

        // TODO: add case statement to deal with "s" key press, that calls the down() method of player
        case "s":
            player.down();
            break;

        // TODO: add case statement to deal with "a" key press, that calls the left() method of player
        case "a":
            player.left();
            break;
        default:
            break;
    }
}
