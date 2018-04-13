import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";

describe("context-menu-item-radio", (): void => {
    generateSnapshots(examples);
});
