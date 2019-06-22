import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import App from "./app";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("App", (): void => {
    test("should not throw", () => {
        expect(() => {
            mount(<App />);
        }).not.toThrow();
    });
});
