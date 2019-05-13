import React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import examples from "./examples.data";
import Checkbox, {
    CheckboxClassNameContract,
    CheckboxHandledProps,
    CheckboxManagedClasses,
    CheckboxProps,
    CheckboxSlot,
    CheckboxState,
    CheckboxUnhandledProps,
} from "./checkbox";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("checkbox", (): void => {
    const managedClasses: CheckboxClassNameContract = {
        checkbox: "checkbox-class",
        checkbox__disabled: "disabled-class",
        checkbox_input: "input-class",
        checkbox_label: "label-class",
        checkbox_stateIndicator: "span-class",
    };

    const inputSelector: string = `.${managedClasses.checkbox_input}`;

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(Checkbox as any).name}`).toBe(
            Checkbox.displayName
        );
    });

    test("should have correct input attribute type 'checkbox'", () => {
        const rendered: ShallowWrapper = shallow(<Checkbox inputId="id" />);
        expect(rendered.find("#id").prop("type")).toBe("checkbox");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Checkbox inputId="id" />);
            shallow(<Checkbox inputId="id" disabled={true} />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: CheckboxHandledProps = {
            managedClasses,
            inputId: "id",
        };

        const unhandledProps: CheckboxUnhandledProps = {
            "aria-label": "label",
        };

        const props: CheckboxProps = { ...handledProps, ...unhandledProps };

        const rendered: any = shallow(<Checkbox {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should add a class and `disabled` attribute to the input element when the disabled prop is true", () => {
        const rendered: any = shallow(
            <Checkbox managedClasses={managedClasses} disabled={true} inputId={"id"} />
        );

        expect(rendered.hasClass("disabled-class")).toBe(true);
        expect(rendered.find(".input-class[disabled]")).not.toBe(undefined);
        expect(rendered.find(".input-class[disabled]").prop("disabled")).toBe(true);
    });

    test("should add `name` attribute to the input element when the name prop is passed", () => {
        const checkboxName: string = "checkbox-name";
        const rendered: any = shallow(
            <Checkbox
                managedClasses={managedClasses}
                name={checkboxName}
                inputId={"id"}
            />
        );

        expect(rendered.find(".input-class").prop("name")).toBe(checkboxName);
    });

    test("should initialize as unchecked if the `checked` prop is not provided", () => {
        expect(
            shallow(<Checkbox managedClasses={managedClasses} inputId="id" />).state(
                "checked"
            )
        ).toBe(false);
    });

    test("should allow a change event to update the checked state when no `checked` prop is provided", () => {
        const rendered: any = shallow(
            <Checkbox managedClasses={managedClasses} inputId="id" />
        );

        expect(rendered.state("checked")).toBe(false);

        rendered.find(inputSelector).simulate("change");

        expect(rendered.state("checked")).toBe(true);
    });

    test("should call a registerd callback after a change event", () => {
        const onChange: any = jest.fn();
        const controlled: any = shallow(
            <Checkbox
                managedClasses={managedClasses}
                checked={true}
                onChange={onChange}
                inputId="id"
            />
        );
        const uncontrolled: any = shallow(
            <Checkbox managedClasses={managedClasses} onChange={onChange} inputId="id" />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("should not allow a change event to update the checked state if props.checked is provided", () => {
        const rendered: any = shallow(
            <Checkbox managedClasses={managedClasses} checked={false} inputId="id" />
        );

        expect(rendered.state("checked")).toEqual(false);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("checked")).toEqual(false);

        rendered.setProps({ checked: true });
        expect(rendered.state("checked")).toEqual(true);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("checked")).toEqual(true);
    });

    test("should accept a slotted label", () => {
        const rendered: any = mount(
            <Checkbox managedClasses={managedClasses} inputId="id">
                <div slot={CheckboxSlot.label} className="test-class">
                    Hello world
                </div>
            </Checkbox>
        );

        expect(rendered.exists(".test-class"));
        expect(rendered.find(".test-class").prop("className")).toContain(
            managedClasses.checkbox_label
        );
    });

    test("should apply a value prop to the input element", (): void => {
        const rendered: any = mount(
            <Checkbox managedClasses={managedClasses} inputId="id" value="myValue" />
        );

        expect(rendered.find("input").prop("value")).toBe("myValue");
    });

    // parametrized checkbox class name tests
    [
        {
            name: "should correctly assign className from input props",
            checkboxHandledProps: {} as CheckboxHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled and root class name is empty",
            checkboxHandledProps: { disabled: true } as CheckboxHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className when is disabled",
            checkboxHandledProps: { disabled: true } as CheckboxHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name not present) and managed class given",
            checkboxHandledProps: {
                disabled: true,
                managedClasses: {
                    checkbox: "checkbox-class",
                },
            } as CheckboxHandledProps,
            className: "",
            expectedClassName: "checkbox-class",
        },
        {
            name:
                "should correctly assign className when is disabled (name present) and managed class given",
            checkboxHandledProps: {
                disabled: true,
                managedClasses: {
                    checkbox: "checkbox-class",
                    checkbox__disabled: "disabled",
                },
            } as CheckboxHandledProps,
            className: "",
            expectedClassName: "checkbox-class disabled",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed and root class name present",
            checkboxHandledProps: {
                disabled: true,
                managedClasses: {
                    checkbox: "checkbox-name",
                    checkbox__disabled: "disabled",
                },
            } as CheckboxHandledProps,
            className: "root-name",
            expectedClassName: "checkbox-name disabled root-name",
        },
        {
            name:
                "should correctly assign className when is indeterminate (name present), managed and root class name present",
            checkboxHandledProps: {
                indeterminate: true,
                managedClasses: {
                    checkbox: "checkbox-name",
                    checkbox__indeterminate: "indeterminate",
                },
            } as CheckboxHandledProps,
            className: "root-name",
            expectedClassName: "checkbox-name indeterminate root-name",
        },
    ].forEach(({ name, checkboxHandledProps, className, expectedClassName }: any) => {
        test(name, () => {
            const props: CheckboxProps = { ...checkboxHandledProps };

            const rendered: any = shallow(<Checkbox {...props} className={className} />);

            expect(rendered.prop("className")).toEqual(expectedClassName);
        });
    });
});
