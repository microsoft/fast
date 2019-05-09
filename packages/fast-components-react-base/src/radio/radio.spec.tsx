import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import examples from "./examples.data";
import Radio, {
    RadioClassNameContract,
    RadioHandledProps,
    RadioProps,
    RadioSlot,
} from "./radio";
import Label from "../label";
import { DisplayNamePrefix } from "../utilities";

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
        expect(`${DisplayNamePrefix}${(Radio as any).name}`).toBe(Radio.displayName);
    });

    test("should have correct input type attribute 'radio'", () => {
        const rendered: ShallowWrapper = shallow(<Radio inputId="radio" />);
        expect(rendered.find("#radio").prop("type")).toBe("radio");
    });

    test("should render with a `radio_disabled` class when an `disabled` prop is passed", () => {
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} inputId="radio" disabled={true} />
        );

        expect(rendered.prop("className")).toBe(
            `${managedClasses.radio} ${managedClasses.radio__disabled}`
        );
    });

    test("should render an input with a `disabled` prop when `disabled` prop is passed as true", () => {
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} inputId="radio" disabled={true} />
        );

        expect(rendered.find(inputSelector).prop("disabled")).toBe(true);
    });

    test("should render an input with an `id` prop when an `id` prop is passed", () => {
        const testId: string = "radio";
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} inputId={testId} />
        );

        expect(rendered.find(inputSelector).prop("id")).toBe(testId);
    });

    test("should render an input with an `name` prop when an `name` prop is passed", () => {
        const testId: string = "radio";
        const radioName: string = "radioName";
        const rendered: any = shallow(
            <Radio managedClasses={managedClasses} inputId={testId} name={radioName} />
        );

        expect(rendered.find(inputSelector).prop("name")).toBe(radioName);
    });

    test("should render a child if one is passed as a child with the `label` slot prop", () => {
        const rendered: any = mount(
            <Radio managedClasses={managedClasses} inputId="radio03">
                <div id="testLabel" slot={RadioSlot.label}>
                    Label
                </div>
            </Radio>
        );

        expect(rendered.find("#testLabel")).not.toBe(undefined);
    });

    test("should NOT render a child if one is passed as a child without the `label` slot prop", () => {
        const rendered: any = shallow(
            <Radio inputId="radio03">
                <div>Label</div>
            </Radio>
        );

        const expected: string =
            '<div><input type="radio" id="radio03"/><span></span></div>';

        expect(rendered.html()).toBe(expected);
    });

    test("should add a `radio_label` className to a child with the `label` slot prop", () => {
        const rendered: any = mount(
            <Radio managedClasses={managedClasses} inputId="radio03">
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
            <Radio managedClasses={managedClasses} inputId="radio04">
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
            <Radio managedClasses={managedClasses} inputId="radioId" />
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
                inputId="radio"
            >
                <div slot={RadioSlot.label} />
            </Radio>
        );
        const uncontrolled: any = shallow(
            <Radio managedClasses={managedClasses} onChange={onChange} inputId="radio" />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("should apply a value prop to the input element", (): void => {
        const rendered: any = mount(
            <Radio managedClasses={managedClasses} inputId="id" value="myValue" />
        );

        expect(rendered.find("input").prop("value")).toBe("myValue");
    });
    // parametrized radio class name tests
    [
        {
            name: "should correctly assign className from input props",
            radioHandledProps: {} as RadioHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled and root class name is empty",
            radioHandledProps: { disabled: true } as RadioHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className when is disabled",
            radioHandledProps: { disabled: true } as RadioHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name not present) and managed class given",
            radioHandledProps: {
                disabled: true,
                managedClasses: {
                    radio: "radio-class",
                },
            } as RadioHandledProps,
            className: "",
            expectedClassName: "radio-class",
        },
        {
            name:
                "should correctly assign className when is disabled (name present) and managed class given",
            radioHandledProps: {
                disabled: true,
                managedClasses: {
                    radio: "radio-class",
                    radio__disabled: "disabled",
                },
            } as RadioHandledProps,
            className: "",
            expectedClassName: "radio-class disabled",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed and root class name present",
            radioHandledProps: {
                disabled: true,
                managedClasses: {
                    radio: "radio-name",
                    radio__disabled: "disabled",
                },
            } as RadioHandledProps,
            className: "root-name",
            expectedClassName: "radio-name disabled root-name",
        },
    ].forEach(({ name, radioHandledProps, className, expectedClassName }: any) => {
        test(name, () => {
            const props: RadioProps = { ...radioHandledProps };

            const rendered: any = shallow(<Radio {...props} className={className} />);

            expect(rendered.prop("className")).toEqual(expectedClassName);
        });
    });
});
