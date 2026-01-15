let currentWord = "";
let drawing = [];
let words = ["Man", "Kite", "Car", "Guitar"];

function setup() {
    createCanvas(1000, 600);
    textSize(30);
    textAlign(CENTER, CENTER);
    pickNewWord();
    background(200);
    colorMode(HSB, 100);
    c = random(100);
    ellipseMode(CENTER);
    frameRate(5);

    // "Next Word" Button
    let nextWordButton = createButton("Next Word");
    nextWordButton.position(20, height + 30);
    nextWordButton.mousePressed(() => {
        pickNewWord(); // Ensure it resets the drawing and word
    });

    // "Clear Drawing" Button
    let clearButton = createButton("Clear Drawing");
    clearButton.position(120, height + 30);
    clearButton.mousePressed(() => {
        drawing = [];
    });
}

function draw() {
    fill(0);
    textSize(24);
    text("Draw this:", width / 2, 30);
    textSize(30);
    text(currentWord, width / 2, 70);
    fill();
    stroke(0);
    strokeWeight(4);

    // Draw the lines
    for (let i = 0; i < drawing.length; i++) {
        let lineData = drawing[i];
        line(lineData.x1, lineData.y1, lineData.x2, lineData.y2); // Corrected
    }
}

function mousePressed() {
    if (mouseY > 90) {
        drawing.push({ x1: pmouseX, y1: pmouseY, x2: mouseX, y2: mouseY });
    }
}

function mouseDragged() {
    if (mouseY > 90) {
        drawing.push({ x1: pmouseX, y1: pmouseY, x2: mouseX, y2: mouseY });
    }
}

function pickNewWord() {
    currentWord = random(words);
    drawing = []; // Clear previous drawing
}

function mouseReleased() {
    if (mouseY > 90) {
        let guess = classifyDrawing();
        if (guess == currentWord) {
            alert("You got it right!");
            pickNewWord();
        } else {
            alert(`You drew a ${guess}. Try drawing a ${currentWord}!`);
        }
    }
}

// Mock-up of a drawing classification (you can implement real logic later)
function classifyDrawing() {
    if (drawing.length > 5) {
        return "Car"; // Example of classifying a drawing
    }
    return "Unknown";
}
