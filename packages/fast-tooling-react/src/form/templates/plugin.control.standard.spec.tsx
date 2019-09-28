import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { StandardControlPlugin } from "./";
import { ControlConfig } from "./template.control.abstract.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("StandardControlPlugin", () => {
    test("should not throw", () => {
        const plugin: StandardControlPlugin = new StandardControlPlugin({
            control: jest.fn(),
        });

        expect(() => {
            mount(plugin.render());
        }).not.toThrow();
    });
    test("should render a StandardControlTemplate", () => {
        const plugin: StandardControlPlugin = new StandardControlPlugin({
            control: jest.fn(),
        });

        const render: any = mount(plugin.render());

        expect(render.find("StandardControlTemplate")).toHaveLength(1);
    });
    test("should render an input provided by the control prop", () => {
        const className: any = "foo";
        const plugin: StandardControlPlugin = new StandardControlPlugin({
            control: (config: ControlConfig): React.ReactNode => {
                return (
                    <input
                        className={className}
                        onChange={config.onChange}
                        type={"number"}
                        onFocus={config.reportValidity}
                        onBlur={config.updateValidity}
                        value={config.value}
                        ref={config.elementRef as React.Ref<HTMLInputElement>}
                    />
                );
            },
        });

        const render: any = mount(plugin.render());

        expect(render.find(`.${className}`)).toHaveLength(1);
    });
});
