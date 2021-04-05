/* eslint-disable */
const chalk = require("chalk");

/* eslint-disable */
function opsLogger(baseline, benchmark) {
    const winner = baseline.hz > benchmark.hz ? baseline : benchmark;
    const looser = winner === baseline ? benchmark : baseline;
    const color = winner === benchmark ? chalk.green : chalk.red;
    const message = `Performance ${
        winner === benchmark ? "increased" : "decreased"
    } by ${winner.hz - looser.hz} ops`;

    console.log(color(message));
}

module.exports = opsLogger;
