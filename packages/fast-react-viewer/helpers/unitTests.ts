const spawn = require('cross-spawn');
const argv = require('yargs').argv;
const chalk = require('chalk');

/**
 * Run jest unit tests
 */
var args = [
    '--notify'
];

if (argv.update || argv.u) {
    args.push('-u');
}

var jestInstance = spawn('./node_modules/.bin/jest', args, {stdio: 'inherit'});

/**
 * If we pass --throw, we should throw an error if the process
 * fails. This allows us to block `git push` if unit tests fail.
 */
if (argv.throw) {
    jestInstance.on('close', (code) => {
        if (code > 0) {
            let error = new Error('Error: One or more Jest tests failed.')
            console.error(chalk.red(error.message));
            throw error;
        }
    });
}