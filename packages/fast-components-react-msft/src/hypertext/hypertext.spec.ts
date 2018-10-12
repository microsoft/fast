import examples from "./examples.data";
import { generateSnapshots, SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { HypertextProps } from "./index";

describe("hypertext snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<HypertextProps>);
});
