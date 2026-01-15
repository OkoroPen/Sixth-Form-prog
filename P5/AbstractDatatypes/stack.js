//STACK
const MAXSTACKSIZE = 8

//when program runs create a stack
const st = new Array(MAXSTACKSIZE)
//declare the array, and and a variable to act as stack pointer
let stackPointer = 0;


function stpush(data) {
    if (stackPointer == MAXSTACKSIZE) {
        console.error('STACK OVERFLOW, The Stack is full.');
    }
    else {
        st[stackPointer] = data
        stackPointer++
    }
}

function stpop() {
    if (stackPointer == 0) {
        console.error('STACK UNDERFLOW, The Stack is empty.')
    }
    else {
        stackPointer--
        return st[stackPointer]
    }
}
function isEmpty() {
    if (stackPointer == st) {
        return true
    }
    else {
        return false
    }
}

function isFull() {
    if (stackPointer == MAXSTACKSIZE) {
        return true
    }
    else {
        return false
    }
}

// P5.js
const stackY = 400
function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
    background(200);
    textSize(12);
    textAlign
}

function draw() {
    let rectWidth = 200;
    let rectHeight = 50;
    let x = (width - rectWidth) / 2; // Center the rectangles horizontally
    let y = 20; // Starting position for the first rectangle

    // Loop to draw 10 stacked rectangles
    for (let i = 0; i < 10; i++) {
        fill(90, 150, 90)
        rect(x, y + i * (rectHeight + 5), rectWidth, rectHeight);
        fill(0);
        text(MAXSTACKSIZE[i], x, y + i * (rectHeight + 5), rectWidth, rectHeight);

        //text(list[i], x + rectWidth / 2, y + (i + 1 / 2) * (rectHeight + 5));
    }
}

function drawPointer() {
    if (stackPointer >= 0) {
        let y = stackY - stackPointer * rectHeight;
        fill(255, 0, 0);
        triangle(125, y + rectHeight / 2, 145, y + rectHeight / 2 - 10, 145, y + rectHeight / 2 + 10);
    }
}






