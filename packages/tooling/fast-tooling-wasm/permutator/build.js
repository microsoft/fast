const { exec } = require("child_process");
const { argv } = require("yargs");

const changeDir = "cd permutator";

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
const staticTestFilesCompile = `gcc -Wall ./__tests__/test.c -ldl -L. -o __tests__/test`;
const dynamicTestFilesSetup = `gcc -Wall -c -fPIC permutate.c -o ./__tests__/libpermutate.o`;
const dynamicTestFilesCompile = `gcc -Wall -shared -fPIC -o ./__tests__/libpermutate.so ${commonFiles.join(
    " "
)} ./__tests__/libpermutate.o`;

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

if (argv.test) {
    /**
     * Execute gcc commands to produce dynamic .so files for testing
     */
    exec(
        `${changeDir} && ${dynamicTestFilesSetup} && ${staticTestFilesCompile} && ${dynamicTestFilesCompile}`,
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
