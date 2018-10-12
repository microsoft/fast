import examples from "./examples.data";
import { generateSnapshots, SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { DividerProps } from "./index";

describe("divider snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<DividerProps>);
});
