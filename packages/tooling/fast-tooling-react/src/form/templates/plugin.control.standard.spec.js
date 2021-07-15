import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { StandardControlPlugin } from "./";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
describe("StandardControlPlugin", () => {
    test("should not throw", () => {
        const plugin = new StandardControlPlugin({
            control: jest.fn(),
        });
        expect(() => {
            mount(plugin.render());
        }).not.toThrow();
    });
    test("should render a StandardControlTemplate", () => {
        const plugin = new StandardControlPlugin({
            control: jest.fn(),
        });
        const render = mount(plugin.render());
        expect(render.find("StandardControlTemplate")).toHaveLength(1);
    });
    test("should render an input provided by the control prop", () => {
        const className = "foo";
        const plugin = new StandardControlPlugin({
            control: config => {
                return (
                    <input
                        className={className}
                        onChange={jest.fn()}
                        type={"number"}
                        onFocus={config.reportValidity}
                        onBlur={config.updateValidity}
                        value={config.value}
                        ref={config.elementRef}
                    />
                );
            },
        });
        const render = mount(plugin.render());
        expect(render.find(`.${className}`)).toHaveLength(1);
    });
});
