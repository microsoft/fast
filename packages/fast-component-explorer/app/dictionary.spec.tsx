import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Dictionary from "./dictionary";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Dictionary", (): void => {
    test("should not throw", () => {
        expect(() => {
            mount(<Dictionary />);
        }).not.toThrow();
    });
});
