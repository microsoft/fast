import { mkdir, writeFile } from "fs/promises";
import { readdir, readFileSync } from "fs";
import { exec } from "child_process";
import { basename, dirname, extname, join, resolve } from "path";

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

export function getTestName(filename) {
    const extension = extname(filename);
    const res = basename(filename, extension);
    return res;
}

async function generateHtmlTemplate(operationFile, compiledJsBench, fileName) {
    const name = getTestName(operationFile);
    const benchScript = readFileSync(`./src/${operationFile}`, "utf8");
    const defaultHtml = `<!DOCTYPE html>
    <html>
    <head></head>
    <body>
    <div id="container"></div>
    <script type="module" src="${compiledJsBench}"></script>
    <script type="module">
        const test = "${name}"
        ${benchScript}
    </script>
    </body>
    </html>`;
    // generate html template of all default suite for benchmark
    const path = await writeConfig(fileName + "-" + name, defaultHtml, ".html", "dist");
    return { name, path };
}
async function generateHtmlTemplates(
    { library, benchmark, operations },
    fileName,
    benchFile = "index"
) {
    const compiledJsBench = `../benchmarks/${library}/${benchmark}/${benchFile}.js`;
    console.log("compiledJsBench", compiledJsBench, fileName);
    // any operation listed under 'src' folder is eligible
    return new Promise((resolve, reject) => {
        readdir("src", async (err, files) => {
            //handling error
            if (err) reject("Unable to scan directory: " + err);

            const operationProps = { names: [], htmlPaths: [] };

            // handle if specific operations are passed in
            if (operations) {
                const fileNames = files.map(f => getTestName(f));
                const match = operations.some(f => fileNames.includes(f));
                if (!match) {
                    reject(
                        "The operation name you passed does not exist, please check spelling or make sure you added the operation test under /src folder."
                    );
                }
                for (let i = 0; i < files.length; i++) {
                    const operationFile = files[i];
                    const operationName = getTestName(operationFile);

                    if (operations.includes(operationName)) {
                        const { name, path } = await generateHtmlTemplate(
                            operationFile,
                            compiledJsBench,
                            fileName
                        );
                        operationProps.names.push(name);
                        operationProps.htmlPaths.push(path);
                    }
                }
            } else {
                // run all possible operations
                // TODO: reduce dup code
                for (let i = 0; i < files.length; i++) {
                    const operationFile = files[i];
                    const { name, path } = await generateHtmlTemplate(
                        operationFile,
                        compiledJsBench,
                        fileName
                    );
                    operationProps.names.push(name);
                    operationProps.htmlPaths.push(path);
                }
            }

            resolve(operationProps);
        });
    }).catch(error => {
        console.log("error", error);
        if (error) {
            throw new Error(error);
        } else {
            return error;
        }
    });
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
 * @returns {{operationName: ConfigFile["benchmarks"]}, {}} returns benchmarkHash, where operation name is key and benchmarks array is value
 */

async function generateBenchmarks(
    { library, benchmark, versions },
    operationProps,
    localProps
) {
    const tachoData = {};
    operationProps.names.forEach((operation, idx) => {
        /** @type {ConfigFile["benchmarks"]} */

        const benchmarks = [];
        const browser = {
            name: "chrome",
            headless: true,
            addArguments: ["--js-flags=--expose-gc", "--enable-precise-memory-info"],
        };
        const measurement = [
            {
                name: "usedJSHeapSize",
                mode: "expression",
                expression: "window.usedJSHeapSize",
            },
            {
                mode: "performance",
                entryName: operation,
            },
        ];

        versions.forEach(version => {
            const isLocalBranch = localProps.branchName && version === LOCAL;
            const isBranch = isLocalBranch || version === MASTER;
            const url =
                isLocalBranch && localProps.operationProps.htmlPaths
                    ? localProps.operationProps.htmlPaths[idx]
                    : operationProps.htmlPaths[idx];

            // TODO: the name can be extracted out from benchmark array and added to the tacho config prop
            const bench = {
                url,
                browser,
                name: `${benchmark}-${operation}`,
                measurement,
            };
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
        tachoData[operation] = benchmarks;
    });

    return tachoData;
}

/**
 * Generate tachometer config file
 * @param {string} fileName
 * @param {{operationName: ConfigFile["benchmarks"]}, {}} benchmarksHash
 * @returns {string[]} array of the paths' location of newly generated config json file
 */
async function generateConfig(fileName, benchmarksHash) {
    try {
        const TACH_SCHEMA =
            "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json";

        const defaultBenchOptions = {
            // Tachometer default is 50, but locally let's only do 10
            sampleSize: 20,
            // Tachometer default is 3 minutes, but let's shrink it to 1 here to save some
            timeout: 0,
        };

        // TODO: add name here
        const pathsPromises = [];
        for (const benchmark in benchmarksHash) {
            const config = {
                $schema: TACH_SCHEMA,
                ...defaultBenchOptions,
                // name: `${benchmark}-${operation}`,
                benchmarks: benchmarksHash[benchmark],
            };

            const path = await writeConfig(
                `${fileName}-${benchmark}` + ".config",
                config,
                ".json",
                "dist"
            );

            pathsPromises.push(path);
        }
        /** @type {ConfigFile[]} promises resolves to array of config file paths*/
        return await Promise.all(pathsPromises);
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
        const fileName = `${options.library}_${options.benchmark}`;

        //special handling if 'local' version was passed in as an option
        const localProps = { branchName: "", operationProps: {} };
        if (options.versions.includes(LOCAL)) {
            localProps.branchName = await getLocalGitBranchName();
            // check if user passed in localBenchFile for different implementation of local
            if (options.localBenchFile)
                localProps.operationProps = await generateHtmlTemplates(
                    options,
                    `${fileName}_${LOCAL}`,
                    options.localBenchFile
                );
        }

        const operationProps = await generateHtmlTemplates(options, fileName);
        const benchmarksHash = await generateBenchmarks(
            options,
            operationProps,
            localProps
        );
        const tachoConfigPaths = await generateConfig(fileName, benchmarksHash);
        return {
            tsConfigPath,
            tachoConfigPaths,
        };
    } catch (error) {
        console.error(error);
    }
}
