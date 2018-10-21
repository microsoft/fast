import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite,
} from "@microsoft/fast-jest-snapshots-react";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import MSFTProgress from "./progress";
import { ProgressProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("progress", (): void => {
    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTProgress />);
        }).not.toThrow();
    });
});
