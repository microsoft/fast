import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { BareControlPlugin } from "./plugin.control.bare";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("BareControlPlugin", () => {
    test("should not throw", () => {
        const plugin: BareControlPlugin = new BareControlPlugin({
            control: jest.fn(),
        });

        expect(() => {
            mount(plugin.render() as JSX.Element);
        }).not.toThrow();
    });
    test("should render a BareControlTemplate", () => {
        const plugin: BareControlPlugin = new BareControlPlugin({
            control: jest.fn(),
        });

        const render: any = mount(plugin.render() as JSX.Element);

        expect(render.find("BareControlTemplate")).toHaveLength(1);
    });
});
