import { mkdir, writeFile } from "fs/promises";
import { exec } from "child_process";
import { dirname, join, resolve } from "path";

/**
 * Creates a dist folder to hold the generated config file.
 * If file already exists, it will replace the existing file with new config.
 * @typedef {import('tachometer/lib/configfile').ConfigFile} ConfigFile Expected
 *  See https://www.npmjs.com/package/tachometer#config-file
 * @param {string} name
 * @param {ConfigFile} config will be stringified if not already
 * @param {string} ext extension configuration for the file
 * @param {string} dest destination folder where config file will be generated, if empty string means it's rootDir
 * @returns {string} path location of newly generated config json file
 */
const ROOT_DIR = "";
const JSON_EXT = ".json";
async function writeConfig(name, config, ext = JSON_EXT, dest = ROOT_DIR) {
    /** @type {boolean} check if des string contains any characters matching a letter, if it does, it is not a rootDir */
    const isRootDir = !dest.match("[a-zA-Z]+") && !ROOT_DIR;
    const configName = name + ext;
    const __dirname = resolve(dirname(isRootDir ? ROOT_DIR : `${dest}`));
    const configPath = join(__dirname, dest, configName);
    if (!isRootDir) await mkdir(join(__dirname, dest), { recursive: true });

    // if ext is JSON, stringify, otherwise leave as is
    const str = ext === JSON_EXT ? JSON.stringify(config, null, 2) : config;
    await writeFile(configPath, str, "utf8");
    return isRootDir ? join(process.cwd(), configName) : join(dest, configName);
}
// create tsconfig.{my-library}.json file and add include path to it
async function generateTsConfig({ library, benchmark }) {
    const tsConfig = {
        extends: "./tsconfig.json",
        include: ["utils/**/*.ts", `benchmarks/${library}/${benchmark}/*.ts`],
    };
    return await writeConfig(`tsconfig.${library}`, tsConfig);
}

/**
 * Generates the html template for benchmark, inject compiled js script in header, spit out output in dist
 */
async function generateHtmlTemplate(
    { library, benchmark },
    fileName,
    benchFile = "index"
) {
    const compiledUtils = "../utils/index.js";
    const compiledJsBench = `../benchmarks/${library}/${benchmark}/${benchFile}.js`;
    //TODO: think about the directory for file output (prob where the benchmark themselves are defined), that means think about the path for utils.js
    const defaultHtml = `<!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    <div id="container"></div>
    <script type="module" src="${compiledJsBench}"></script>
    <script type="module">
            import {
                destroy,
                measureMemory,
                getTestStartName,
                updateComplete,
            } from "${compiledUtils}";
            (async () => {
                const container = document.getElementById("container");
                const create = () => {
                    const el = document.createElement("x-app");
                    return container.appendChild(el);
                };
                const render = async () => {
                    // can change to main dir file name
                    const test = "create10k";
                    const start = getTestStartName(test);
                    performance.mark(start);
                    create();
                    await updateComplete();
                    performance.measure(test, start);
                    destroy(container);
                };
                await render();
                measureMemory();
                const update = async () => {
                    let el = create();
                    const test = "update10th";
                    const start = getTestStartName(test);
                    performance.mark(start);
                    for (let i = 0; i < el.items.length; i += 10) {
                        el.items[i].label += "!!!";
                    }
                    await updateComplete();
                    performance.measure(test, start);
                    destroy(container);
                };
                await update();
                measureMemory();
            })();
        </script>
    </body>
    </html>`;
    // generate html template of all default suite for benchmark
    // const configName = `${library}_${benchmark}`;
    return await writeConfig(fileName, defaultHtml, ".html", "dist");
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
 * Generates the benchmarks array expected by the tachometer config file.
 * @returns {ConfigFile["benchmarks"], []} an array of benchmarks
 */

async function generateBenchmarks(
    { library, benchmark, versions, memory },
    htmlPath,
    localProps
) {
    const MEMORY_METRIC = "memory";
    const isMemoryBench = benchmark.toLowerCase() === MEMORY_METRIC || memory;

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
                  entryName: "create10k",
              },
              {
                  mode: "performance",
                  entryName: "update10th",
              },
          ];

    const browser = {
        name: "chrome",
        headless: true,
    };

    if (isMemoryBench)
        browser.addArguments = ["--js-flags=--expose-gc", "--enable-precise-memory-info"];

    /** @type {ConfigFile["benchmarks"]} */
    const benchmarks = [];
    versions.forEach(version => {
        const isLocalBranch = localProps.branchName && version === LOCAL;
        const isBranch = isLocalBranch || version === MASTER;
        const url = isLocalBranch && localProps.htmlPath ? localProps.htmlPath : htmlPath;

        const bench = { url, browser, name: benchmark, measurement };
        const dep = `@microsoft/${library}`;
        if (isBranch) {
            const ref = isLocalBranch ? localProps.branchName : MASTER;
            bench.packageVersions = {
                label: version,
                dependencies: {
                    [dep]: {
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
            bench.packageVersions = {
                label: version,
                dependencies: { [dep]: version },
            };
        }
        benchmarks.push(bench);
    });
    return benchmarks;
}

/**
 * Generate tachometer config file
 * @returns {string} path location of newly generated config json file
 */
async function generateConfig(fileName, benchmarks) {
    try {
        const TACH_SCHEMA =
            "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json";

        const defaultBenchOptions = {
            // Tachometer default is 50, but locally let's only do 10
            sampleSize: 30,
            // Tachometer default is 3 minutes, but let's shrink it to 1 here to save some
            timeout: 1,
        };

        /** @type {ConfigFile} */
        const config = { $schema: TACH_SCHEMA, ...defaultBenchOptions, benchmarks };
        return await writeConfig(fileName + ".config", config, ".json", "dist");
    } catch (error) {
        console.log("error", error);
    }
}

/**
 * Creates a dist folder to hold the generated config file.
 * If file already exists, it will replace the existing file with new config.
 * @typedef {import('tachometer/lib/configfile').ConfigFile} ConfigFile Expected
 *  See https://www.npmjs.com/package/tachometer#config-file
 * @param {import('commander').OptionValues } options
 * @returns {string} path location of newly generated config json file
 */
const LOCAL = "local";
const MASTER = "master";
export async function generateTemplates(options) {
    try {
        const tsConfigPath = await generateTsConfig(options);

        //special handling if 'local' version was passed in as an option
        const localProps = { branchName: null, htmlPath: null };
        // let localBranchName, localBenchFilePath;
        if (options.versions.includes(LOCAL)) {
            localProps.branchName = await getLocalGitBranchName();
            // check if user passed in localBenchFile for different implementation of local
            if (options.localBenchFile)
                localProps.htmlPath = await generateHtmlTemplate(
                    options,
                    options.localBenchFile
                );
        }

        const fileName = `${options.library}_${options.benchmark}`;
        const htmlPath = await generateHtmlTemplate(options, fileName);
        const benchmarks = await generateBenchmarks(options, htmlPath, localProps);
        const tachoConfigPath = await generateConfig(fileName, benchmarks);

        return { tsConfigPath, tachoConfigPath };
    } catch (error) {
        console.error(error);
    }
}
