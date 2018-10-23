import * as Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import * as path from "path";
import { includesAllSubdirectoriesAsNamedExports } from "../../../build/helpers/file-includes-all-subdirectories-as-named-exports";

configure({adapter: new Adapter()});

describe("index.ts", (): void => {
    test("Should export all components in the src directory", () => {
        expect(includesAllSubdirectoriesAsNamedExports(path.resolve(__dirname, "index.ts"))).toEqual([]);
    });
});
