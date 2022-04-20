const { exec } = require("child_process");
const { writeFile, mkdir } = require("fs/promises");
const { join } = require("path");
const { program } = require("commander");
const { spawn } = require("cross-spawn");

program
    .option("-l, --library <name>", "run benchmarks in <name> library")
    .option("-b, --benchmark <name>", "run the benchmark: <name>")
    .option("-m, --memory", "check memory metrics")
    .option(
        "-v, --versions [versions...]",
        "specify available versions, you can also use 'local' or 'master' that would point to github branches"
    )
    .option(
        "-lb, --localBenchFile <name>",
        "specify the html file you want your local version to use, only valid if 'local' is one of the versions you passed in"
    )
    .parse(process.argv);

const options = program.opts();

//TODO: add defaults
const { library, benchmark: benchmarkName, versions, localBenchFile, memory } = options;
console.log("options", options);

const TACH_SCHEMA =
    "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json";

const MEMORY_METRIC = "memory";
const LOCAL = "local";
const MASTER = "master";

//create tachometer schema based on options
const defaultBenchOptions = {
    // Tachometer default is 50, but locally let's only do 10
    sampleSize: 30,
    // Tachometer default is 3 minutes, but let's shrink it to 1 here to save some
    timeout: 1,
};

//TODO: customize measurement types
const isMemoryBench = benchmarkName.toLowerCase() === MEMORY_METRIC || memory;

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
              entryName: benchmarkName,
          },
      ];

/**
 * Generates the benchmarks array expected by the tachometer config file.
 * @returns {ConfigFile["benchmarks"], []} an array of benchmarks
 */
async function generateBenchmarks() {
    const localBranchName = versions.includes(LOCAL)
        ? await getLocalGitBranchName()
        : undefined;

    const browser = {
        name: "chrome",
        headless: true,
    };

    if (isMemoryBench)
        browser.addArguments = ["--js-flags=--expose-gc", "--enable-precise-memory-info"];

    /** @type {ConfigFile["benchmarks"]} */
    const benchmarks = [];
    versions.forEach(version => {
        const isLocalBranch = version === LOCAL;
        const isBranch = isLocalBranch || version === MASTER;
        const htmlFile = isLocalBranch && localBenchFile ? localBenchFile : "index.html";
        const url = `benchmarks/${library}/${benchmarkName}/${htmlFile}`;

        const benchmark = { url, browser, name: benchmarkName, measurement };
        const package = `@microsoft/${library}`;
        if (isBranch) {
            const ref = version === LOCAL ? localBranchName : MASTER;
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
        res.stdout.on("data", data =>
            data ? resolve(data.trim()) : reject("Error in getting local branch name.")
        );
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
        const benchmarks = await generateBenchmarks();
        /** @type {ConfigFile} */
        const config = { $schema: TACH_SCHEMA, ...defaultBenchOptions, benchmarks };
        return await writeConfig(benchmarkName + ".config", config, "dist");
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
        const configPath = await generateConfig();
        console.log("configPath", configPath);
        await checkNpmRegistryIsAvailable();
        const tsConfigPath = await writeConfig(`tsconfig.${library}`, tsConfig);
        await buildBenchmark(tsConfigPath);
        await runBenchmark(configPath);
    } catch (error) {
        return error;
    }
};

run();
