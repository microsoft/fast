const { exec } = require("child_process");
const { writeFile, mkdir } = require("fs/promises");
const { join } = require("path");
const { program } = require("commander");
const { spawn } = require("cross-spawn");

program
    .option("-l, --library <name>", "run benchmarks in <name> library")
    .option("-b, --benchmark <name>", "run the benchmark: <name>")
    .option(
        "-v, --versions [versions...]",
        "specify versions, if not specified, default is local and master"
    )
    .parse(process.argv);

const options = program.opts();

//TODO: add defaults
const { library, benchmark, versions } = options;
console.log("options", options);

const TACH_SCHEMA =
    "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json";

//create tachometer schema based on options
// TODO: these need to be moved to browser options
// browser: "chrome",
// headless: true,
// addArguments: ["--js-flags=--expose-gc", "--enable-precise-memory-info"],
const defaultBenchOptions = {
    // Tachometer default is 50, but locally let's only do 10
    sampleSize: 10,
    // Tachometer default is 3 minutes, but let's shrink it to 1 here to save some
    timeout: 1,
};

//TODO: customize measurement types
const isMemoryBench = benchmark.toLowerCase() === "memory";

const measurement = isMemoryBench
    ? [
          {
              name: "usedJSHeapSize",
              mode: "expression",
              expression: "window.usedJSHeapSize",
          },
      ]
    : [
          {
              mode: "performance",
              entryName: benchmark,
          },
      ];

async function generateBenchmarks(localBranchName) {
    const url = `benchmarks/${library}/${benchmark}/index.html`;
    const browser = {
        name: "chrome",
        headless: true,
    };

    if (isMemoryBench)
        browser.addArguments = ["--js-flags=--expose-gc", "--enable-precise-memory-info"];
    /** @type {ConfigFile["benchmarks"]} */
    const benchmarks = [];
    versions.forEach(version => {
        const isBranch = version === "local" || version === "master";
        const benchmark = { url, browser, name: benchmark, measurement };
        const package = `@microsoft/${library}`;
        if (isBranch) {
            const ref = version === "local" ? localBranchName : "master";
            benchmark.packageVersions = {
                label: version,
                dependencies: {
                    [package]: {
                        kind: "git",
                        repo: "https://github.com/microsoft/fast.git",
                        ref,
                        subdir: `packages/web-components/${library}`,
                        setupCommands: [
                            "yarn install",
                            `yarn --cwd ./packages/web-components/${library} build`,
                        ],
                    },
                },
            };
        } else {
            benchmark.packageVersions = {
                label: version,
                dependencies: { [package]: version },
            };
        }
        benchmarks.push(benchmark);
    });
    return benchmarks;
}

/**
 * Creates a dist folder to hold the generated config file.
 * If file already exists, it will replace the existing file with new config.
 * @typedef {import('tachometer/lib/configfile').ConfigFile} ConfigFile Expected
 *  See https://www.npmjs.com/package/tachometer#config-file
 * @param {string} name
 * @param {ConfigFile} config
 * @param {string} dest destination folder where config file will be generated, if empty string means it's rootDir
 * @returns {string} path location of newly generated config json file
 */

const ROOT_DIR = "";
async function writeConfig(name, config, dest = ROOT_DIR) {
    /** @type {boolean} check if des string contains any characters matching a letter, if it does, it is not a rootDir */
    const isRootDir = !dest.match("[a-zA-Z]+") && !ROOT_DIR;
    const configName = name + ".json";
    const configPath = join(__dirname, "../" + dest, configName);

    if (!isRootDir) await mkdir(join(__dirname, "../" + dest), { recursive: true });
    await writeFile(configPath, JSON.stringify(config, null, 2), "utf8");

    return isRootDir ? join(process.cwd(), configName) : join(dest, configName);
}

/**
 * Get current local git branch name
 *  @returns {Promise}
 */
//TODO: add in Documentation, 'local' & 'master' as one of the versions options only works in a git repo context
async function getLocalGitBranchName() {
    return new Promise((resolve, reject) => {
        const res = exec("git branch --show-current");
        res.stdout.on("data", data => (data ? resolve(data.trim()) : reject()));
    }).catch(error => {
        throw new Error(
            `Unable to retrieve local branch name: ${error}, make sure you have "git" installed.`
        );
    });
}

/**
 * Generate tachometer config file
 * @returns {string} path location of newly generated config json file
 */
async function generateConfig() {
    try {
        const localBranchName = await getLocalGitBranchName();
        const benchmarks = await generateBenchmarks(localBranchName);
        /** @type {ConfigFile} */
        const config = { $schema: TACH_SCHEMA, ...defaultBenchOptions, benchmarks };

        return await writeConfig(benchmark + ".config", config, "dist");
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Check to see if we can reach the npm repository within a timeout
 *  @returns {Promise}
 */
async function checkNpmRegistryIsAvailable() {
    return new Promise(resolve => {
        resolve(
            new Promise(resolve => {
                exec("npm ping", { timeout: 1000 }, error => {
                    resolve(error === null);
                });
            }).catch(error => {
                throw error;
            })
        );
    }).catch(error => {
        throw error;
    });
}

/**
 * Build tsc file
 * @param {string} configPath the generated tsconfig path
 * @returns {Promise}
 */
async function buildBenchmark(configPath) {
    return new Promise((resolve, reject) => {
        const args = ["-p", configPath];
        const child = spawn("tsc", args, { stdio: "inherit" });
        child.on("close", code => {
            if (code !== 0) {
                reject({
                    command: `tsc -p ${configPath}`,
                });
                return;
            }
            resolve(void 0);
        });
    }).catch(error => {
        throw error;
    });
}

/**
 * Run generated tachometer config file
 * @param {string} configPath
 * @returns {Promise}
 */
async function runBenchmark(configPath) {
    console.log("run at config path", configPath);
    return new Promise((resolve, reject) => {
        const args = ["tach", "--config", configPath];
        const child = spawn("npx", args, { stdio: "inherit" });
        child.on("close", code => {
            if (code !== 0) {
                reject({
                    command: `npx tach --config ${configPath}`,
                });
                return;
            }
            resolve(void 0);
        });
    }).catch(error => {
        return error;
    });
}

// create tsconfig.{my-library}.json file and add include path to it
const tsConfig = {
    extends: "./tsconfig.json",
    include: ["utils/**/*.ts", `benchmarks/${library}/**/*.ts`],
};

const run = async () => {
    try {
        const configPath = await generateConfig(options);
        await checkNpmRegistryIsAvailable();
        const tsConfigPath = await writeConfig(`tsconfig.${library}`, tsConfig);
        await buildBenchmark(tsConfigPath);
        await runBenchmark(configPath);
    } catch (error) {
        return error;
    }
};

run();
