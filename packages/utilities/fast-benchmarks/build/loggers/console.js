/* eslint-disable */

const chalk = require("chalk");

module.exports = (name, result) => {
    console.log(`Emitting results for "${name.replace(".html", "")}"`);
    Object.keys(result).forEach(key => {
        const color = result[key] >= 0 ? chalk.green : chalk.red;

        console.log(color(`${key}: ${result[key]}`));
    });
};
