const { exec } = require("child_process");
const { argv } = require("yargs");
const process = require("process");
const chalk = require("chalk");

// Do not run on win32 as dlfcn.h is not available
const isWin32 = process.platform === "win32";
const changeDir = "cd permutator";
const moveLib = "mv ../libpermutate.so libpermutate.so";
const changeTestDir = "cd __tests__";

/**
 * Common files needed for compilation
 */
const commonFiles = ["type.c", "permutate_number.c", "parse.c", "cjson/cJSON.c"];

/**
 * Emscripten files needed for compilation
 */
const emccFiles = ["wasm.c", "permutate.c"].concat(commonFiles).join(" ");

/**
 * Test file needed for compilation
 */
const staticTestFilesCompile = `gcc -Wall -L. "-Wl,-rpath,." -o test test.c -ldl -lpermutate -lm -o test`;
const sharedLibSetup = `gcc -Wall -c -fPIC permutate.c -o libpermutate.o`;
const sharedLibCompile = `gcc -Wall -shared -fPIC -o libpermutate.so ${commonFiles.join(
    " "
)} libpermutate.o`;

/**
 * Settings for emscripten
 */
const emccSettings = [
    {
        name: "WASM",
        value: 1,
    },
    {
        name: "EXPORTED_FUNCTIONS",
        value: '["_permutate"]',
    },
    {
        name: "EXTRA_EXPORTED_RUNTIME_METHODS",
        value: '["cwrap"]',
    },
].reduce((cmdLineArgs, setting) => {
    return (cmdLineArgs += ` -s ${setting.name}=${setting.value}`);
}, "");

if (!isWin32) {
    if (argv.test) {
        /**
         * Execute gcc commands to produce dynamic .so files for testing
         * keep in mind that pathing is an issue, so these are created at the
         * project directory and then moved to the testing directory to run
         * the tests against
         */
        exec(
            `${changeDir} && ${sharedLibSetup} && ${sharedLibCompile} && ${changeTestDir} && ${moveLib} && ${staticTestFilesCompile}`,
            (error, stdout, stderr) => {
                if (error) {
                    throw new Error(`error: ${error.message}`);
                }
                if (stderr) {
                    throw new Error(`stderr: ${stderr}`);
                }
                if (stdout) {
                    console.log(`stdout: ${stdout}`);
                }
            }
        );
    } else {
        /**
         * Execute the emscripten command to build wasm and js files
         */
        exec(
            `${changeDir} && emcc ${emccFiles} -Os ${emccSettings} -o permutator.js`,
            (error, stdout, stderr) => {
                if (error) {
                    throw new Error(`error: ${error.message}`);
                }
                if (stderr) {
                    throw new Error(`stderr: ${stderr}`);
                }
                if (stdout) {
                    console.log(`stdout: ${stdout}`);
                }
            }
        );
    }    
} else {
    console.log(chalk.red("Testing cannot be performed on Win32 due to the incompatability with the dlfcn library."))
}
