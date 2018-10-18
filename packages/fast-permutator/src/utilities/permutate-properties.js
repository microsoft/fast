/**
 * Return an array of objects based on possible permutations
 * @param {number} index - The index of the dataArray.
 * @param {array} dataArray - The array of data containing the objects properties.
 * @param {array} dataToBeAdded - The data to be added as a permutation.
 * @return {array} - Permutations of properties.
 */
module.exports = function(index, dataArray, dataToBeAdded) {
    return permutateProperties(index, dataArray, dataToBeAdded);
};

/**
 * Permutates properties
 * @param {number} index - The index of the dataArray.
 * @param {array} dataArray - The array of data containing the objects properties.
 * @param {array} dataToBeAdded - The data to be added as a permutation.
 * @return {array} - Permutations of properties.
 */
let permutateProperties = function(index, dataArray, dataToBeAdded) {
    let newDataToBeAdded = [];

    if (!dataArray[index]) {
        dataArray.push([{}]);
    }

    for (let data of dataArray[index]) {
        if (index === 0) {
            newDataToBeAdded.push(Object.assign({}, data));
        } else {
            for (let addedData of dataToBeAdded) {
                newDataToBeAdded.push(Object.assign({}, addedData, data));
            }
        }
    }

    if (dataArray[index + 1]) {
        return permutateProperties(index + 1, dataArray, newDataToBeAdded);
    } else {
        return newDataToBeAdded;
    }
};
