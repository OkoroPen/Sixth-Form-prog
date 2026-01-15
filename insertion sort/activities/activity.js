//insertion sort
function insertionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let pointer = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > pointer) {
            arr[j + 1] = arr[j];
            j--

            arr[j + 1] = pointer;
        }
    }
    return arr
}
let arr = [12, 37, 90.9, 24, 576, 87, 3564, 104];
insertionSort(arr);

//p5
let values = [];
let i = 1;
let j = 0;

function setup() {
    createCanvas(800, 400);
    frameRate(10);
    background(200);
    values = Array.from({ length: width / 10 }, () => random(height));
}

function draw() {
    background(200);
    for (let k = 0; k < values.length; k++) {
        if (k === i) {
            fill(255, 0, 0); // Highlight current element
        } else if (k === j) {
            fill(0, 255, 0); // Highlight element being compared
        } else {
            fill(255);
        }
        rect(k * 10, height - values[k], 10, values[k]); // Draw rectangles
    }

    // Perform one step of insertion sort per frame
    if (i < values.length) {
        let pointer = values[i];
        while (j >= 0 && values[j] > pointer) {
            values[j + 1] = values[j];
            j--;
        }
        values[j + 1] = pointer;
        i++;
        j = i - 1;
    } else {
        noLoop(); // Stop the draw loop when sorting is complete
        console.log(values); // Print sorted array
    }
}

