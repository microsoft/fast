const watch = require("watch");
const path = require("path");
const spawn = require("child_process").spawn;

function success(str) {
    console.log("\x1b[32m%s\x1b[0m", str);
}

function clearConsole() {
    console.log('\033[2J')
}

watch.watchTree(path.resolve(__dirname, "../src"), (modifiedFile, currentStat, previousStat) => {
    clearConsole();
    if (typeof modifiedFile === "object" && currentStat === null && previousStat === null) {
        success("Watching for typescript changes");
    } else if (/\.tsx?$/.test(modifiedFile)) {
        spawn("npm", ["run", "lint"], { stdio: "inherit" })
        .on("exit", (error) => {
            if (error && error.code === 1) {
                throw error;
            } else if (error === 0) {
                success("Typescript successfully linted with no errors found.\nWatching for changes...");
            }
        });
    }
});
