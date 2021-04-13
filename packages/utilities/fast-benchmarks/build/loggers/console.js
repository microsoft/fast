/* eslint-disable */

const chalk = require("chalk");

function colorByKey(key, value) {
    switch (key) {
        case "hz":
            return value >= 0 ? chalk.green : chalk.red;
        case "mean":
            return value >= 0 ? chalk.red : chalk.green;
        default:
            return value >= 0 ? chalk.red : chalk.green;
    }
}

module.exports = (name, result) => {
    console.log(`Emitting results for "${name.replace(".html", "")}"`);
    Object.keys(result).forEach(key => {
        console.log(colorByKey(key, result[key])(`${key}: ${result[key]}`));
    });
};
