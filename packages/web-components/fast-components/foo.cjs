const glob = require("glob");
const path = require("path");
const fs = require("fs");

glob("./src/**/*.definition.json", ( files, matches ) => {
    matches.forEach(file => {
        const parsed = path.parse(file);
        const dest = path.resolve(parsed.dir, parsed.name + ".ts");

        fs.rename(file, dest, () => {
            fs.unlink(file, () => {

            });
        });
    })
})
