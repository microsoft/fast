const glob = require("glob");
const path = require("path");
const fs = require("fs");

glob("./src/**/*.definition.ts", ( files, matches ) => {
    matches.forEach(file => {
        let content = fs.readFileSync(file).toString();
        content = "export default " + content;
        fs.writeFileSync(file, content);
        // const parsed = path.parse(file);
        // const dest = path.resolve(parsed.dir, parsed.name + ".ts");

        // fs.rename(file, dest, () => {
        //     fs.unlink(file, () => {

        //     });
        // });
    })
})
