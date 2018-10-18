import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite,
} from "@microsoft/fast-jest-snapshots-react";
import { Typography } from "./index";

describe("typography snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<Typography>);
});
