const path = require("path");
const fs = require("fs");

exports.getPackageJsonDir = name => {
    const entry = require.resolve(name).toString();
    let dir = path.parse(entry).dir;

    while (!fs.existsSync(path.resolve(dir, "package.json"))) {
        dir = path.parse(dir).dir;
    }

    return dir;
};
