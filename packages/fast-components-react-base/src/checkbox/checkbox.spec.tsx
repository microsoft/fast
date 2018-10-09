import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots, SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import Checkbox, {
    CheckboxClassNameContract,
    CheckboxHandledProps,
    CheckboxManagedClasses,
    CheckboxProps,
    CheckboxSlot,
    CheckboxState,
    CheckboxUnhandledProps
} from "./checkbox";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("checkbox snapshot", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<CheckboxProps>);
});

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
        expect((Checkbox as any).name).toBe(Checkbox.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<Checkbox inputId="id" />);
                shallow(<Checkbox inputId="id" disabled={true} />);
            }
        ).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: CheckboxHandledProps = {
            managedClasses,
            inputId: "id"
        };

        const unhandledProps: CheckboxUnhandledProps = {
            "aria-label": "label"
        };

        const props: CheckboxProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Checkbox {...props} />
        );

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should add a class and `disabled` attribute to the input element when the disabled prop is true", () => {
        const rendered: any = shallow(
            <Checkbox
                managedClasses={managedClasses}
                disabled={true}
                inputId={"id"}
            />
        );

        expect(rendered.hasClass("disabled-class")).toBe(true);
        expect(rendered.find(".input-class[disabled]")).not.toBe(undefined);
        expect(rendered.find(".input-class[disabled]").prop("disabled")).toBe(true);
    });

    test("should initialize as unchecked if the `checked` prop is not provided", () => {
        expect(
            shallow(
                <Checkbox
                    managedClasses={managedClasses}
                    inputId="id"
                />
            )
            .state("checked")
        ).toBe(false);
    });

    test("should allow a change event to update the checked state when no `checked` prop is provided", () => {
        const rendered: any = shallow(
            <Checkbox
                managedClasses={managedClasses}
                inputId="id"
            />
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
            <Checkbox
                managedClasses={managedClasses}
                onChange={onChange}
                inputId="id"
            />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("should not allow a change event to update the checked state if props.checked is provided", () => {
        const rendered: any = shallow(
            <Checkbox
                managedClasses={managedClasses}
                checked={false}
                inputId="id"
            />
        );

        expect(rendered.state("checked")).toEqual(false);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("checked")).toEqual(false);

        rendered.setProps({checked: true});
        expect(rendered.state("checked")).toEqual(true);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("checked")).toEqual(true);
    });

    test("should accept a slotted label", () => {
        const rendered: any = mount(
            <Checkbox
                managedClasses={managedClasses}
                inputId="id"
            >
                <div
                    slot={CheckboxSlot.label}
                    className="test-class"
                >
                        Hello world
                </div>
            </Checkbox>
        );

        expect(rendered.exists(".test-class"));
        expect(rendered.find(".test-class").prop("className")).toContain(managedClasses.checkbox_label);
    });
});
