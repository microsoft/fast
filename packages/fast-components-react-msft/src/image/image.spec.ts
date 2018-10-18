import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite,
} from "@microsoft/fast-jest-snapshots-react";
import { ImageProps } from "./index";

describe("image snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<ImageProps>);
});
