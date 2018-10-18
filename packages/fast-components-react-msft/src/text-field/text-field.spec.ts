import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite
} from "@microsoft/fast-jest-snapshots-react";
import { TextFieldProps } from "./index";

describe("text-field snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<TextFieldProps>);
});
