import React from "react";
import CardContainer from "./card-container";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Background", (): void => {
    test("should not throw", (): void => {
        expect(
            (): void => {
                mount(<CardContainer />);
            }
        ).not.toThrow();
    });
});
