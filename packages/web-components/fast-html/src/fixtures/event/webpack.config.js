import path from "path";
import { fileURLToPath } from "url";
import { merge } from "webpack-merge";
import config from "../../../webpack.common.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "./");

export default merge(config, {
    entry: path.resolve(__dirname, "./main.ts"),
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "../../../server/dist/event"),
    }
});
