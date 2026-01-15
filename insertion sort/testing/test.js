
//insersion sort tests
if (insertionSort([]) == null) {
    console.warn("Insertion Sort Activity not started")
} else {
    console.log("Testing insertionSort()...")

    testCount = 0
    testCount += test(insertionSort([1, 5, 2, 7, 9, 4, 2, 5, 8, 0]), [0, 1, 2, 2, 4, 5, 5, 7, 8, 9])
    testCount += test(insertionSort(['a', 'h', 'gg', 'gh', 'z']), ['a', 'gg', 'gh', 'h', 'z'])
    testCount += test(insertionSort([]), [])

    if (testCount > 0) {
        console.error("---Testing Failed---")
    } else {
        console.log("---Testing Passed---")
    }
}


function test(result, expected) {
    result = JSON.stringify(result)
    expected = JSON.stringify(expected)
    failed = false
    if (result === expected) {
        console.log("PASS")

    } else {
        console.error("FAIL: expected " + expected + " recieved " + result)
        failed = true
    }
    return failed
}