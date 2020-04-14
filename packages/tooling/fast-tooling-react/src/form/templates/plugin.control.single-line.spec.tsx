import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SingleLineControlPlugin } from "./plugin.control.single-line";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("SingleLineControlPlugin", () => {
    test("should not throw", () => {
        const plugin: SingleLineControlPlugin = new SingleLineControlPlugin({
            control: jest.fn(),
        });

        expect(() => {
            mount(plugin.render() as JSX.Element);
        }).not.toThrow();
    });
    test("should render a SingleLineControlTemplate", () => {
        const plugin: SingleLineControlPlugin = new SingleLineControlPlugin({
            control: jest.fn(),
        });

        const render: any = mount(plugin.render() as JSX.Element);

        expect(render.find("SingleLineControlTemplate")).toHaveLength(1);
    });
});
