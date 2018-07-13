import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";

describe("checkbox", (): void => {
    generateSnapshots(examples);
});
