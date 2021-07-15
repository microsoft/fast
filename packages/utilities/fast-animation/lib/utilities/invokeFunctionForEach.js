/**
 * For each item in an array, invoke a function
 */
export function invokeFunctionForEach(arr, name) {
    arr.forEach(arrItem => arrItem[name]());
}
