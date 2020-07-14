const { exec } = require("child_process");

const changeDir = "cd permutator";

/**
 * Files needed for compilation
 */
const files = [
    "wasm.c",
    "type.c",
    "permutate.c",
    "permutate_number.c",
    "parse.c",
    "cjson/cJSON.c",
].join(" ");

/**
 * Settings for emscripten
 */
const settings = [
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

/**
 * Execute the emscripten command to build wasm and js files
 */
exec(
    `${changeDir} && emcc ${files} -Os ${settings} -o permutator.js`,
    (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        }
    }
);
