const { exec } = require("child_process");
const { writeFile, mkdir } = require("fs/promises");
const { join } = require("path");
const { program } = require("commander");

program
    .option("-l, --library <name>", "run benchmarks in <name> library")
    .option("-t, --test <name>", "run the <name> test")
    .option(
        "-v, --versions [versions...]",
        "specify versions, if not specified, default is local and master"
    )
    .parse(process.argv);

const options = program.opts();

const TACH_SCHEMA =
    "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json";

//create tachometer schema based on options
// TODO: these need to be moved to browser options
const defaultBenchOptions = {
    browser: "chrome",
    headless: true,
    addArguments: ["--js-flags=--expose-gc", "--enable-precise-memory-info"],
    // Tachometer default is 50, but locally let's only do 10
    sampleSize: 20,
    // Tachometer default is 10% but let's do 5% to save some GitHub action
    // minutes by reducing the likelihood of needing auto-sampling. See
    // https://github.com/Polymer/tachometer#auto-sampling
    horizon: "5%",
    // Tachometer default is 3 minutes, but let's shrink it to 1 here to save some
    // GitHub Action minutes
    timeout: 1,
    "window-size": "1024,768",
    trace: false,
};

//customize measurement
const measurement = [
    {
        mode: "performance",
        entryName: "binding",
    },
];

const generateBenchmarks = async (options, localBranchName) => {
    const { library, test, versions } = options;
    const url = `benchmarks/${library}/${test}/index.html`;
    const browser = {
        name: "chrome",
        headless: true,
    };

    const benchmarks = [];
    versions.forEach(version => {
        const isBranch = version === "local" || version === "master";
        const benchmark = { url, browser, name: version, measurement };
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
            console.log(ref, "benchmark", benchmark.packageVersions.dependencies);
        } else {
            benchmark.packageVersions = {
                label: version,
                dependencies: { [package]: version },
            };
        }
        benchmarks.push(benchmark);
    });
    return benchmarks;
};

async function writeConfig(name, config) {
    const configPath = join(__dirname, "../dist", name + ".config.json");

    await mkdir(join(__dirname, "../dist"), { recursive: true });
    await writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
    return configPath;
}

const generateTachometerConfig = async (options, localBranchName) => {
    const benchmarks = await generateBenchmarks(options, localBranchName);
    const config = { $schema: TACH_SCHEMA, ...defaultBenchOptions, benchmarks };

    await writeConfig("hi", config);
};

exec("git branch --show-current", (err, stdout, stderr) => {
    if (err) throw new Error(err);

    if (stdout.trim() === "master") {
        console.warn(
            `You are currently on the master branch\n,` +
                `if you want to benchmark against your local branch, switch to your branch first!\n` +
                `"git switch [branch_name]"`
        );
    }

    if (typeof stdout === "string") {
        const localBranchName = stdout.trim();
        generateTachometerConfig(options, localBranchName);
    }
});
