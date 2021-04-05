/* eslint-disable */
const getBenchmarkPaths = require("./utils/get-benchmark-names");
const path = require("path");
const { program } = require("commander");
const fs = require("fs");

program.version(
    JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"))).version
);

program
    .option("-b, --baseline", "save benchmark results as new comparative baseline")
    .option("-a, --all", "run all benchmarks")
    .option("-n, --name <name>", "run benchmark by name");

program.parse(process.argv);

const options = program.opts();
const testNamesToRun = getBenchmarkPaths(
    path.resolve(__dirname, "../", "benchmarks")
).filter(name => {
    return options.all || options.baseline || options.name === name;
});

if (testNamesToRun.length === 0) {
    throw new Error(
        "No benchmark to run was provided. Run the program with --help for instructions on how to provide benchmarks"
    );
}

const baselinePath = path.resolve(__dirname, "../temp/baseline.json");

if (!options.baseline && !fs.existsSync(baselinePath)) {
    console.error(
        "No baseline.json file found. Run program with -b argument to generate a baseline.json"
    );
    exit(1);
}

const baselines = JSON.parse(fs.readFileSync(baselinePath).toString());
const loggers = [require("./analyzers/ops")];

/**
 * Start webpack-dev-server and hook up build-completion callback
 */
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("../webpack.config");
const opsLogger = require("./analyzers/ops");
const port = config.devServer.port;
const compiler = webpack(config);
compiler.hooks.done.tap("benchmark", webpackDone);
var server = new WebpackDevServer(compiler);
console.log("Starting the dev web server...");
server.listen(port, "localhost", function(err) {
    if (err) {
        console.error(err);
        exit(1);
    }

    console.log("WebpackDevServer listening at localhost:", port);
});

/**
 * Runs through benchmark test pages, runs page's benchmark test,
 * and returns results.
 * @param {string[]} htmlPaths
 * @returns {[htmlPath: string], benchmarkResults}
 */
async function runBenchmarks(htmlPaths) {
    const { chromium } = require("playwright");
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const results = {};

    for (var i = 0; i < htmlPaths.length; i++) {
        const name = htmlPaths[i];
        console.log(`Starting benchmark for "${name.replace(".html", "")}"`);
        await page.goto(`localhost:${port}/${name}`);
        const result = await page.evaluate(async () => {
            return await bench.default.run();
        });

        results[name] = result;
    }

    await browser.close();

    return results;
}

/**
 * Invoked from
 * @param stats
 */
async function webpackDone(stats) {
    console.log("Webpack build completed.");
    const { emittedAssets } = stats.compilation;
    const testPaths = testNamesToRun.map(x => `${x}.html`);

    // There should be an emitted .html file for each benchmark, but just to make sure
    for (let testPath of testPaths) {
        if (!emittedAssets.has(testPath)) {
            console.error(
                "\nEntry without corresponding .html not found. No such path to run benchmark test.\n"
            );
            exit(1);
        }
    }

    const results = await runBenchmarks(testPaths);

    if (options.baseline) {
        emitBaseline(results);
    } else {
        let compare = Object.keys(results)
            .map(x => {
                const result = results[x];
                const baseline = baselines[x];

                if (!baseline) {
                    console.error(
                        `No baseline found for ${x}. Run program with -b argument to generate baseline.`
                    );
                    exit(1);
                }

                return [x, baseline, result];
            })
            .forEach(x => {
                console.log(`Emitting results for ${x[0]}:`);
                opsLogger(x[1], x[2]);
                console.log("\n\n");
            });

        // diffing algorithm
    }

    exit(0);
}

/**
 * Exits the program, shutting down webpack-dev-server if it is listening
 * @param {number} code
 */
function exit(code) {
    if (server) {
        server.close();
    }

    process.exit(code);
}

/**
 * Emits results to the baseline.json file
 */
function emitBaseline(results) {
    require("mkdirp")(path.dirname(baselinePath));
    fs.writeFileSync(baselinePath, JSON.stringify(results, null, 2));
    console.log(`Baseline results emitted to "${baselinePath}"`);
}
