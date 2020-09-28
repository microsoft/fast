const fs = require("fs-extra");
const path = require("path");
const { makeBadge } = require("badge-maker");

const siteUtilitiesDir = path.dirname(
    require.resolve("@microsoft/site-utilities/package.json")
);
const staticsAssetsDir = path.resolve(siteUtilitiesDir, "statics/assets");

const formats = {
    "License-MIT-yellow.svg": {
        color: "yellow",
        label: "License",
        message: "MIT",
    },
    "maintained with-lerna-cc00ff.svg": {
        color: "cc00ff",
        label: "maintained with",
        message: "lerna",
    },
    "typescript.svg": {
        color: "0074c1",
        label: "</>",
        message: "TypeScript",
    },
    "code_style-prettier-f8bc45.svg": {
        color: "ff69b4",
        label: "code style",
        message: "prettier",
    },
    "ES6-Supported-yellow.svg": {
        color: "yellow",
        label: "ES6",
        message: "Supported",
        style: "for-the-badge",
    },
    "typescript-supported-blue.svg": {
        color: "blue",
        label: "TypeScript",
        message: "Supported",
        style: "for-the-badge",
    },
    "waapi-supported-purple.svg": {
        color: "purple",
        label: "WAAPI",
        message: "Supported",
        style: "for-the-badge",
    },
    "discord.svg": {
        color: "7289DA",
        label: "chat on ",
        message: "discord",
    },
};

[
    "@microsoft/fast-element",
    "@microsoft/fast-components",
    "@microsoft/fast-foundation",
].map(p => {
    try {
        const { name, version: message } = require(`${p}/package.json`);
        const packageName = name.split("/").pop();
        formats[`${encodeURIComponent(packageName)}.svg`] = {
            label: "npm package",
            message,
        };
    } catch (err) {
        console.log(err);
    }
});

Object.entries(formats).forEach(async ([filename, format]) => {
    const svg = makeBadge(format);
    try {
        await fs.outputFile(`${staticsAssetsDir}/badges/${filename}`, svg);
    } catch (err) {
        console.error(err);
    }
});
