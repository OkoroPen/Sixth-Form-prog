/**
 * Really Simple Maze game
 * Array holds maze data
 * Player has coordinates and these are changed according to keypress and array content
 * If the player reaches the exit, then win
 * If the player stumbles in to the firepit then lose
 */

// TASK 4: declare required variables
// TODO: declare a variable called level
let level
// TODO: declare a variable called cellSize
let cellSize
// TODO: declare a constant called mazeSize with a value of 7
let mazeSize = 7
// TODO: declare a variable called player
let player

// array of colours for maze parts
// position 0 is for path, 1 for wall, 2 for exit, 3 for firepit
let cellColour = ["white", "grey", "green", "red"];
// game state variable and constants
const GSPLAY = 0
const GSLOSE = 1
const GSWIN = 2
let gameState = GSPLAY

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(150);
    ellipseMode(CORNER);
    noStroke();
    //alert("******************\nComplete TASK 4\n******************\nThen remove the code\nthat generates this alert")
    // add the reset button
    let b = createButton('New Game')
    b.position(0, 0)
    b.mousePressed(initLevel)
    initLevel()
}
function draw() {
    // iterate through the level array to draw the maze
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            // use the array value as the colour index
            fill(cellColour[level[y][x]]);
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    player.draw();
    // TASK 7: draw appropriate message to show gamestate
    // TODO: if the gameState is GSWIN display "You've won" or similar in a large message in middle of screen

    // TODO: if the gameState is GSLOSE display "You've lost" or similar in a large message in middle of screen
    if (gameState === GSWIN) {
        fill(0, 255, 0); // Green text for winning
        textSize(32);
        textAlign(CENTER, CENTER);
        text("YOU WIN!", width / 2, height / 2);
    } else if (gameState === GSLOSE) {
        fill(255, 0, 0); // Red text for losing
        textSize(32);
        textAlign(CENTER, CENTER);
        text("YOU LOSE!", width / 2, height / 2);
    }
}



function keyPressed() {
    // use wasd to navigate
    console.log(key)
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

function initLevel() {
    // a 7x7 array represents level
    // 3 is firepit, 2 is exit, 1 is wall, 0 is path

    level = [
        [1, 1, 1, 1, 1, 2, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 3, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 3, 1, 1]
    ];

    gameState = GSPLAY
    // fit the maze in to the screen
    cellSize = floor(min(width / mazeSize, height / mazeSize));
    // create a player at position 1,5 in the maze
    // note that this uses the Player class defined in player.js
    player = new Player(1, 5);
}

function preload() {
    // character uses images, need to preload these to avoid errors when drawing
    playerImages = [loadImage("images/up.png"), loadImage("images/right.png"), loadImage("images/down.png"), loadImage("images/left.png")]
}