import Adapter from 'enzyme-adapter-react-16'
import { configure } from "enzyme";
import * as path from "path";
import { includesAllSubdirectoriesAsNamedExports } from "./file-includes-all-subdirectories-as-named-exports";

configure({ adapter: new Adapter() });

describe("file-includes-all-subdirectories-as-named-exports.ts", (): void => {
    test("should export all components in the __tests__ directory", () => {
        expect(
            includesAllSubdirectoriesAsNamedExports(path.resolve(__dirname, "__tests__/src/index.ts"))
        ).toEqual([]);
    });
});
