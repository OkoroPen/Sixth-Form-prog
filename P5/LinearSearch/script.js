let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function linearSrch(list, target) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] == target) {
            return true
        }
    }
    return false
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
    background(200);
    textSize(25);
    textAlign(CENTER, CENTER);

}

function draw() {
    let rectWidth = 200;
    let rectHeight = 70;
    let x = (width - rectWidth) / 2;
    let y = 20;

    for (let i = 0; i < list.length; i++) {
        fill(90, 150, 90)

        rect(x, y + i * (rectHeight + 5), rectWidth, rectHeight);
        fill(0);
        text(list[i], x + rectWidth / 2, y + (i + 1 / 2) * (rectHeight + 5));

    }
}

function searchArrow() {
    if (list.length >= 0) {
        let y = list.length * rectHeight;
        fill(255, 0, 0);
        triangle(125, y + rectHeight / 2, 145, y + rectHeight / 2 - 10, 145, y + rectHeight / 2 + 10);
    }
}