import { globSync } from "node:fs";
import { execSync } from "node:child_process";

const files = globSync("dist/esm/**/*.spec.js", {
    exclude: ["dist/esm/**/*.pw.spec.js"],
});

execSync(`node --test ${files.join(" ")}`, { stdio: "inherit" });
