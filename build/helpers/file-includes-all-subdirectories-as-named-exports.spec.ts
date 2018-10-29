import * as path from "path";
import { includesAllSubdirectoriesAsNamedExports } from "./file-includes-all-subdirectories-as-named-exports";

describe("file-includes-all-subdirectories-as-named-exports.ts", (): void => {
    test("should export all components in the __tests__ directory index.ts", () => {
        expect(() => {
            includesAllSubdirectoriesAsNamedExports(path.resolve(__dirname, "__tests__/src/index.ts"));
        }).not.toThrow();
    });

    test("should throw an error if exports are missing in the __tests__ directory missingExport.ts", () => {
        expect(() => {
            includesAllSubdirectoriesAsNamedExports(path.resolve(__dirname, "__tests__/src/missingExport.ts"))
        }).toThrow();
    });
});
