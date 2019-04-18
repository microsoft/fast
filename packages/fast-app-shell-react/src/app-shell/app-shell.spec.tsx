import React from "react";
import { AppShell } from "./index";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";

configure({ adapter: new Adapter() });

describe("AppShell", (): void => {
    test("should not throw", (): void => {
        expect(() => {
            shallow(<AppShell apps={[]} />);
        }).not.toThrow();
    });
});
