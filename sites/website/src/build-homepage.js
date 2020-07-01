// FIXME: #3298 Merge fast-website and website projects to replace temporary build/copy script

/* eslint-env node */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { spawn } = require("child_process");
const path = require("path");
const copyfiles = require("copyfiles");

const projectPath = path.resolve(__dirname, "../../fast-website");
const staticPath = path.resolve(__dirname, "../static");
const indexPath = path.resolve(projectPath, "dist/index.html");
const utilitiesPath = path.resolve(__dirname, "../../site-utilities");

const copyConfig = { flat: true, verbose: true, up: true };

function copyBundle() {
    copyfiles([indexPath, staticPath], copyConfig, () => {
        console.log("Copied homepage files to static");
    });

    copyfiles(
        [`${projectPath}/dist/bundle/*`, `${staticPath}/bundle`],
        copyConfig,
        () => {
            console.log("Copied homepage files to static");
        }
    );

    copyfiles(
        [`${utilitiesPath}/statics/assets/favicon.ico`, staticPath],
        copyConfig,
        () => {
            console.log("Copied favicon to static");
        }
    );
}

// Run `yarn build` in the fast-website project
const yarnBuild = spawn("yarn", ["build"], { cwd: projectPath });

yarnBuild.stdout.on("data", data => console.log(`stdout: ${data}`));
yarnBuild.stderr.on("data", data => console.log(`stderr: ${data}`));
yarnBuild.on("error", error => console.log(`error: ${error.message}`));

yarnBuild.on("close", exitCode => {
    console.log(`child process exited with code ${exitCode}`);
    if (exitCode !== 0) {
        process.exit(exitCode);
    }

    copyBundle();
});
