import { exec } from "child_process";
import chalk from "chalk";
import { program } from "commander";
import { spawn } from "cross-spawn";
import { generateTemplates } from "./template.js";
const errMessage = chalk.hex("#ffb638");

program
    .option("-l, --library <name>", "run benchmarks in <name> library")
    .option("-b, --benchmark <name>", "run the benchmark: <name>")
    .option(
        "-v, --versions [versions...]",
        "specify available versions, you can also use 'local' or 'master' that would point to github branches"
    )
    .option(
        "-m, --methods [methods...]",
        "specify different methods through url query params for one version you want to benchmark"
    )
    .option(
        "-lb, --localBenchFile <name>",
        "specify the html file you want your local version to use, only valid if 'local' is one of the versions you passed in"
    )
    .option(
        "-o, --operations [versions...]",
        "specify the operations you want the benchmarks to run, if none are passed all available operations will be run"
    )
    .parse(process.argv);

const options = program.opts();

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
        return error;
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
        return error;
    });
}

/**
 * Run generated tachometer config file
 * @param {string} configPath
 * @returns {Promise}
 */
async function runBenchmark(configPaths) {
    const promises = [];
    for (let i = 0; i < configPaths.length; i++) {
        const configPath = configPaths[i];
        const res = new Promise((resolve, reject) => {
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
            if (error.command) {
                console.log(
                    errMessage(
                        `Make sure your local branch is pushed to git to use the 'local' keyword in versions: failed at ${error.command}:`
                    )
                );
            } else {
                return error;
            }
        });
        promises.push(res);
    }
    return await Promise.all(promises);
}

const run = async () => {
    try {
        await checkNpmRegistryIsAvailable();
        const { tsConfigPath, tachoConfigPaths } = await generateTemplates(options);
        await buildBenchmark(tsConfigPath);
        await runBenchmark(tachoConfigPaths);
    } catch (error) {
        return error;
    }
};

run();
