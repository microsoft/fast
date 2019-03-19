import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTSelect from "./select";
import { SelectOption } from "../select-option";
import { Select, SelectHandledProps, SelectProps, SelectUnhandledProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const itemA: JSX.Element = <SelectOption id="a" value="a" displayString="a" />;
const itemB: JSX.Element = <SelectOption id="b" value="b" displayString="ab" />;
const itemC: JSX.Element = <SelectOption id="c" value="c" displayString="abc" />;

describe("button", (): void => {
    const href: string = "https://www.microsoft.com";

    test("should have a displayName that matches the component name", () => {
        expect((MSFTSelect as any).name).toBe(MSFTSelect.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTSelect />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: SelectUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<MSFTSelect {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("default trigger attributes are set correctly", (): void => {
        const rendered: any = mount(
            <Select labelledBy="test-labelledBy">
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        const trigger: any = rendered.find("button");
        expect(trigger.prop("aria-labelledby")).toEqual("test-labelledBy");
        expect(trigger.prop("aria-haspopup")).toEqual(true);
        expect(trigger.prop("aria-expanded")).toEqual(false);
    });

    test("Custom trigger render function is called", (): void => {
        const triggerRenderFn: any = jest.fn();
        triggerRenderFn.mockReturnValue("Test");
        const rendered: any = mount(
            <Select trigger={triggerRenderFn}>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );
        expect(triggerRenderFn).toHaveBeenCalledTimes(1);
    });
});
