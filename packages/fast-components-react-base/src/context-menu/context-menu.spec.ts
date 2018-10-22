import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";

describe("context-menu", (): void => {
    //    generateSnapshots(examples);
    test("foo", (): void => {
        expect(2).toBe(2);
    });
});
