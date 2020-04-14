import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SelectOption } from "../select-option";
import { DisplayNamePrefix } from "../utilities";
import MSFTSelect from "./select";
import { Select, SelectUnhandledProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const itemA: JSX.Element = <SelectOption id="a" value="a" displayString="a" />;
const itemB: JSX.Element = <SelectOption id="b" value="b" displayString="ab" />;
const itemC: JSX.Element = <SelectOption id="c" value="c" displayString="abc" />;

describe("select", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTSelect as any).name}`).toBe(
            MSFTSelect.displayName
        );
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

    test("default trigger aria tags are set correctly", (): void => {
        const rendered: any = mount(
            <Select selectedItems={["a"]}>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        const trigger: any = rendered.find("button");
        expect(trigger.prop("aria-expanded")).toEqual(false);
        expect(trigger.prop("aria-haspopup")).toEqual("listbox");
    });

    test("Custom menu render function is called", (): void => {
        const menuRenderFn: jest.Mock = jest.fn();
        menuRenderFn.mockReturnValue("Test");
        const rendered: any = mount(
            <Select menu={menuRenderFn}>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        rendered.simulate("click");
        expect(menuRenderFn).toHaveBeenCalledTimes(1);
    });
});
