import examples from "./examples.data";
import { generateSnapshots, SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { DialogProps } from "./index";

describe("dialog snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<DialogProps>);
});
