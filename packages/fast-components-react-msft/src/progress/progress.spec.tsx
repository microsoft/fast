import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import MSFTProgress from "./progress";
import { ProgressProps } from "./index";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("progress", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTProgress as any).name}`).toBe(
            MSFTProgress.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTProgress />);
        }).not.toThrow();
    });
});
