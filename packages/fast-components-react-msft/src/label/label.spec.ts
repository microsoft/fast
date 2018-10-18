import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite
} from "@microsoft/fast-jest-snapshots-react";
import { LabelProps } from "./index";

describe("label snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<LabelProps>);
});
