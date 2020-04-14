import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Preview from "./preview";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Preview", (): void => {
    test("should not throw", () => {
        expect(() => {
            mount(<Preview />);
        }).not.toThrow();
    });
});
