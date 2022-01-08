#!/usr/bin/env node
/* eslint-disable no-console */
"use-strict";

const commander = require("commander");
const fs = require("fs-extra");
const path = require("path");

const packageJson = require("./package.json");

let projectName;

function init() {
    const program = new commander.Command(packageJson.name)
        .version(packageJson.version)
        .arguments("<project-directory>")
        .usage("<project-directory> [options]")
        .action(name => {
            projectName = name;
        })
        .option(
            "--template <path-to-template>",
            "specify a template for the created project"
        )
        .parse(process.argv);

    if (typeof projectName === "undefined") {
        console.error("Please specify the project directory:");
        console.log(" <project-directory>");
        process.exit(1);
    }
    console.log(program.projectName);
    console.log(program.template);

    createProject(projectName, program.template);
}

function createProject(name, template) {
    const root = path.resolve(name);
    const appName = path.basename(root);

    fs.ensureDirSync(name);

    console.log(`creating in ${root}.`);
    const packageJson = {
        name: appName,
        version: "0.1.0",
        private: true,
    };
    fs.writeFileSync(
        path.join(root, "package.json"),
        JSON.stringify(packageJson, null, 2)
    );

    const originialDirectory = process.cwd();
    process.chdir(root);

    run(root, originialDirectory, template);
}

function install(root, dependencies) {
    return new Promise((resolve, reject) => {
        let command;
        let args;

        command = "npm";
        args = [
            "install",
            "--no-audit",
            "--save",
            "--save-exact",
            "--loglevel",
            "error",
        ].concat(dependencies);

        const child = spawn(command, args, { stdio: "inherit" });
        child.on("close", code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(" ")}`,
                });
                return;
            }
            resolve();
        });
    });
}

function run(root, originalDirectory, template) {
    const allDependencies = ["@microsoft"];
    Promise.all([
        getPackage(originalDirectory),
        getTemplate(template, originalDirectory),
    ]).then([]);

    return install(root, allDependencies);
}

function getTemplate(template) {
    let templateToInstall = "fast-create-template";
    if (template) {
        templateToInstall = template;
    }

    return Promise.resolve(templateToInstall);
}

module.exports = { init };
