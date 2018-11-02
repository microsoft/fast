import * as path from "path";
import { includesAllSubdirectoriesAsNamedExports } from "../../../build/helpers/file-includes-all-subdirectories-as-named-exports";

describe("index.ts", (): void => {
    test("should export all components in the src directory", () => {
        expect(() => {
            includesAllSubdirectoriesAsNamedExports(path.resolve(__dirname, "index.ts"));
        }).not.toThrow();
    });
});
