import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";

describe("image snapshots", (): void => {
    generateSnapshots(examples);
});
