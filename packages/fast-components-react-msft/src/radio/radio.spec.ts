
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";

describe("radio snapshots", (): void => {
    generateSnapshots(examples);
});