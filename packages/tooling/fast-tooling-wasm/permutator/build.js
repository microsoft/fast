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
const staticTestFilesCompile = `gcc __tests__/test.c -o __tests__/test`;
const dynamicTestFilesSetup = `gcc -c permutate.c -o ./__tests__/libPermutate.o`;
const dynamicTestFilesCompile = `gcc -shared -o ./__tests__/libPermutate.so ${commonFiles.join(
    " "
)} ./__tests__/libPermutate.o`;

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
