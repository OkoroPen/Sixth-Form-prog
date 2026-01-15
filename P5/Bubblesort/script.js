let my8array = ["David", "Becky", "John", "Samuel", "Pentecost", "Lucian", "Rose", "Summer"];
function bubbleSort(my8array) {
    let n = my8array.length;
    let swapped;
    do {
        swapped = false; // Flag Reset

        for (let i = 0; i < n - 1; i++) {
            if (my8array[i] > my8array[i + 1]) { // Swap
                let temp = my8array[i];
                my8array[i] = my8array[i + 1];
                my8array[i + 1] = temp;
                swapped = true;
            }
        }
        n--; // Reduce the range of the array for the next pass
    } while (swapped); // Repeat if a swap was made
    console.log(my8array); // Log the sorted array after sorting
}
bubbleSort(my8array); // Call the function
