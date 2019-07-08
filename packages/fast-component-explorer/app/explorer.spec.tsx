import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Explorer from "./explorer";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Explorer", (): void => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Explorer />);
        }).not.toThrow();
    });
});
