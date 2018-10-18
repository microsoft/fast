import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite
} from "@microsoft/fast-jest-snapshots-react";
import { ToggleProps } from "./index";

describe("toggle snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<ToggleProps>);
});
