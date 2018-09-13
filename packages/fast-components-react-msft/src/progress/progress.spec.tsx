import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { IProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    IMSFTProgressClassNameContract,
    IMSFTProgressHandledProps,
    IMSFTProgressManagedClasses,
    IMSFTProgressUnhandledProps,
} from "./progress";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("progress snapshots", (): void => {
    generateSnapshots(examples);
});
