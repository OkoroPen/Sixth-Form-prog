let list = ["Goat", "Cow", "Dog", "Chicken", "Dino", "Lion", "Wolf", "Eagle", "Shark", "Monkey"];
let LB = 0;
let UB = list.length - 1;
let mid = Math.floor((LB + UB) / 2);
function binarySearch(list, item) {
    while (LB <= UB) {
        let mid = Math.floor((LB + UB) / 2);
        if (list[mid] === item) {
            return true;
        }
        if (list[mid] < item) {
            LB = mid + 1;
        } else {
            UB = mid - 1;
        }
    }
    return false
}
//p5
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(1);
}
function draw(item) {
    background(220);
    textSize(20)
    for (let i = 0; i < list.length; i++) {
        fill(255)
        stroke(0)
        rect(i * 100, height / 2, 150, 40);
        fill(0)
        text(list[i], i * 100 + 10, height / 2 + 30)

        if (LB <= UB) {
            fill(0, 255, 0)
            rect(mid * 100, height / 2, 100, 40);
            fill(0);
            text(list[mid], mid * 100 + 10, height / 2);
        }
    }

    if (list[mid] === item) {
        fill(0, 255, 0)
        text("Found at index;" + mid, 100, 50)
        noLoop();
    } else {
        fill(0);
        text("", 100, 50);
        noLoop();
    }
}             
