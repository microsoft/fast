/* eslint-disable */

const chalk = require("chalk");

module.exports = (name, result) => {
    console.log(`Emitting results for "${name.replace(".html", "")}"`);
    Object.keys(result).forEach(key => {
        let color;
        switch (key) {
            case "mean":
            case "mean percentage":
                color = result[key] <= 0 ? chalk.green : chalk.red;
                break;
            default:
                color = result[key] >= 0 ? chalk.green : chalk.red;
                break;
        }

        console.log(color(`${key} change: ${result[key]}`));
    });
};
