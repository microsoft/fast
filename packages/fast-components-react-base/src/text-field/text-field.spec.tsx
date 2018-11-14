import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, render, shallow } from "enzyme";
import examples from "./examples.data";
import TextField, {
    TextFieldClassNameContract,
    TextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldProps,
    TextFieldType,
    TextFieldUnhandledProps,
} from "./text-field";

const managedClasses: TextFieldClassNameContract = {
    textField: "text-field-class",
};

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("text-field", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((TextField as any).name).toBe(TextField.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<TextField />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: TextFieldHandledProps = {
            managedClasses,
            type: TextFieldType.email,
        };

        const unhandledProps: TextFieldUnhandledProps = {
            "aria-hidden": true,
        };
        const props: TextFieldProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<TextField {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should set a default type of `text` if no `type` prop is passed", () => {
        const rendered: any = shallow(<TextField managedClasses={managedClasses} />);

        expect(rendered.prop("type")).not.toBe(undefined);
        expect(rendered.prop("type")).toEqual(TextFieldType.text);
    });

    test("should render a type of `email` element when `TextFieldType.email` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.email} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.email);
    });

    test("should render a type of `number` element when `TextFieldType.number` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.number} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.number);
    });

    test("should render a type of `password` element when `TextFieldType.password` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.password} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.password);
    });

    test("should render a type of `search` element when `TextFieldType.search` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.search} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.search);
    });

    test("should render a type of `tel` element when `TextFieldType.tel` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.tel} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.tel);
    });

    test("should render a type of `text` element when `TextFieldType.text` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.text} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.text);
    });

    test("should render a type of `url` element when `TextFieldType.url` is passed to the `type` prop", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} type={TextFieldType.url} />
        );

        expect(rendered.prop("type")).toEqual(TextFieldType.url);
    });

    test("should NOT render with a disabled value if no `disabled` prop is passed", () => {
        const rendered: any = shallow(<TextField managedClasses={managedClasses} />);

        expect(rendered.prop("disabled")).toBe(null);
    });

    test("should render with a `disabled` value when `disabled` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.prop("disabled")).toBe(true);
    });

    test("should NOT render with a placeholder value if no `placeholder` prop is passed", () => {
        const rendered: any = shallow(<TextField managedClasses={managedClasses} />);

        expect(rendered.prop("placeholder")).toBe(null);
    });

    test("should render with a placeholder value when `placeholder` prop is passed", () => {
        const rendered: any = shallow(
            <TextField managedClasses={managedClasses} placeholder={"Test"} />
        );

        expect(rendered.prop("placeholder")).toEqual("Test");
    });
});
