import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import Radio, { RadioClassNameContract, RadioSlot } from "./radio";
import Label from "../label";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("radio", (): void => {
    const managedClasses: RadioClassNameContract = {
        radio: "radio",
        radio__disabled: "radio__disabled",
        radio_input: "radio_input",
        radio_label: "radio_label",
        radio_stateIndicator: "radio_stateIndicator",
    };

    const inputSelector: string = `.${managedClasses.radio_input}`;

    test("should have a displayName that matches the component name", () => {
        expect((Radio as any).name).toBe(Radio.displayName);
    });

    test("should render with a `radio_disabled` class when an `disabled` prop is passed", () => {
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} id="radio" disabled={true} />
        );

        expect(rendered.prop("className")).toBe(
            `${managedClasses.radio} ${managedClasses.radio__disabled}`
        );
    });

    test("should render an input with a `disabled` prop when `disabled` prop is passed as true", () => {
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} id="radio" disabled={true} />
        );

        expect(rendered.find(inputSelector).prop("disabled")).toBe(true);
    });

    test("should render an input with an `id` prop when an `id` prop is passed", () => {
        const testId: string = "radio";
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} id={testId} />
        );

        expect(rendered.find(inputSelector).prop("id")).toBe(testId);
    });

    test("should render a child if one is passed as a child with the `label` slot prop", () => {
        const rendered: any = mount(
            <Radio managedClasses={managedClasses} id="radio03">
                <div id="testLabel" slot={RadioSlot.label}>
                    Label
                </div>
            </Radio>
        );

        expect(rendered.find("#testLabel")).not.toBe(undefined);
    });

    test("should NOT render a child if one is passed as a child without the `label` slot prop", () => {
        const rendered: any = shallow(
            <Radio id="radio03">
                <div>Label</div>
            </Radio>
        );

        const expected: string =
            '<div><input type="radio" id="radio03"/><span></span></div>';

        expect(rendered.html()).toBe(expected);
    });

    test("should add a `radio_label` className to a child with the `label` slot prop", () => {
        const rendered: any = mount(
            <Radio managedClasses={managedClasses} id="radio03">
                <div id="testLabel" slot={RadioSlot.label}>
                    Label
                </div>
            </Radio>
        );

        expect(rendered.find("#testLabel").prop("className")).toBe(
            managedClasses.radio_label
        );
    });

    test("should append a `radio_label` className to a child with existing classes and the `label` slot prop", () => {
        const existingClass: string = "existingLabelClass";

        const rendered: any = mount(
            <Radio managedClasses={managedClasses} id="radio04">
                <div id="testLabel" className={existingClass} slot={RadioSlot.label}>
                    Label
                </div>
            </Radio>
        );

        const expectedClass: string = `${existingClass} ${managedClasses.radio_label}`;

        expect(rendered.find("#testLabel").prop("className")).toBe(expectedClass);
    });

    test("should initialize as unchecked if the `checked` prop is not provided", () => {
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} id="radioId" />
        );

        expect(rendered.find(inputSelector).prop("checked")).toBe(false);
    });

    test("should call a registered callback after a change event", () => {
        const onChange: any = jest.fn();
        const controlled: any = shallow(
            <Radio
                managedClasses={managedClasses}
                checked={true}
                onChange={onChange}
                id="radio"
            >
                <div slot={RadioSlot.label} />
            </Radio>
        );
        const uncontrolled: any = shallow(
            <Radio managedClasses={managedClasses} onChange={onChange} id="radio" />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });
});
