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
    return options.all || options.name === name;
});

if (testNamesToRun.length === 0) {
    throw new Error(
        "No benchmark to run was provided. Run the program with --help for instructions on how to provide benchmarks"
    );
}

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("../webpack.config");
const port = config.devServer.port;
const compiler = webpack(config);
compiler.hooks.done.tap("benchmark", webpackDone);

const server = new WebpackDevServer(compiler);
console.log("Starting the dev web server...");
server.listen(port, "localhost", function(err) {
    if (err) {
        console.error(err);
        exit(1);
    }

    console.log("WebpackDevServer listening at localhost:", port);
});

async function runBenchmarks(names) {
    const { chromium } = require("playwright");
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const results = new Map();

    for (var i = 0; i < names.length; i++) {
        const name = names[i];
        console.log(`Starting benchmark for "${name.replace(".html", "")}"`);
        await page.goto(`localhost:${port}/${name}`);
        const result = await page.evaluate(async () => {
            return await bench.default.run();
        });

        results.set(name, result);
    }

    await browser.close();

    return results;
}

async function webpackDone(stats) {
    console.log("Webpack build completed.");
    const { emittedAssets, entries } = stats.compilation;
    const testPaths = Array.from(entries.keys()).map(x => `${x}.html`);

    // There should be an emitted .html file for each entry, but just to make sure
    for (let testPath of testPaths) {
        if (!emittedAssets.has(testPath)) {
            console.error(
                "Entry without .html not found. No such path to run benchmark test."
            );
            exit(1);
        }
    }

    const results = await runBenchmarks(testPaths);
    testPaths.forEach(x => {
        console.log(results.get(x));
    });
    // console.log(results);
    exit(0);
}

function exit(code) {
    server.close();
    process.exit(code);
}
