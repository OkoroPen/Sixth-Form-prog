const ARRAYSIZE = 8
let my8array = new Array(ARRAYSIZE)
let FP = 0;
let RP = 0


function enqueue(data) {
    if (RP != ARRAYSIZE) {
        my8array[RP] = data
        RP++
    }
    else {
        console.error('QUEUE OVERFLOW, The queue is full.');
    }
}

function dequeue() {
    if (FP != RP) {
        FP++
        return my8array[FP]
    }
    else {
        console.error('STACK UNDERFLOW, The Stack is empty.')
    }
}

function isEmpty() {
    if (RP == FP) {
        return true
    }
    else {
        return false
    }
}

function isFull() {
    if (RP == ARRAYSIZE) {
        return true
    }
    else {
        return false
    }
}

function circularqueue() {
    if (FP = RP) {

    }
}
function setup() {
    createCanvas(windowWidth, windowHeight)
    noLoop();
    background(200);
    textSize(12);
    background(200);
    let centerX = width / 2;
    let centerY = height / 2;
}
function draw() {
    ellipseMode(CENTER);
    fill(255);
    circle(windowWidth / 2, windowHeight / 2, 500,);
    fill(200);
    circle(windowWidth / 2, windowHeight / 2, 250,);
    line(CENTER, windowWidth / 2, 500, CENTER, 500);
}
for (i = 0; i = sin(i); i++) { }



/*function drawFrontPointer() {
    if (FP !== 0) {
        let frontAngle = front * angleStep;
        let frontX = centerY + radius
    }
}*/





