import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, render, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import TextField, {
    ITextFieldClassNameContract,
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextFieldProps,
    TextFieldType
} from "./text-field";

const managedClasses: ITextFieldClassNameContract = {
    textField: "text-field-class"
};

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("text-field snapshot", (): void => {
    generateSnapshots(examples);
});

describe("text-field", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((TextField as any).name).toBe(TextField.displayName);
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ITextFieldHandledProps & ITextFieldManagedClasses = {
            managedClasses,
            type: TextFieldType.email
        };

        const unhandledProps: ITextFieldUnhandledProps = {
            "aria-hidden": true
        };
        const props: TextFieldProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <TextField {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should set a default type of `text` if no `type` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} />
        );

        expect(rendered.prop("type")).not.toBe(undefined);
        expect(rendered.prop("type")).toEqual(TextFieldType.text);
    });

    test("should render the correct `type` when `type` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.email} />
        );

        expect(rendered.prop("type")).not.toBe(undefined);
        expect(rendered.prop("type")).toEqual(TextFieldType.email);
    });

    test("should NOT render with a disabled value if no `disabled` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} />
        );

        expect(rendered.prop("disabled")).toBe(null);
    });

    test("should render with a `disabled` value when `disabled` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.prop("disabled")).toBe(true);
    });

    test("should NOT render with a placeholder value if no `placeholder` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} />
        );

        expect(rendered.prop("placeholder")).toBe(null);
    });

    test("should render with a placeholder value when `placeholder` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} placeholder={"Test"} />
        );

        expect(rendered.prop("placeholder")).toEqual("Test");
    });
});
