import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";
import TextField, {
    TextFieldAppearance,
    TextFieldHandledProps,
    TextFieldProps,
    TextFieldUnhandledProps,
} from "./text-field";

const managedClasses: TextFieldClassNameContract = {
    textField: "text-field",
    textField__filled: "text-field--filled",
    textField__outline: "text-field--outline",
};

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("text-field", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(TextField as any).name}`).toBe(
            TextField.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<TextField />);
            shallow(<TextField appearance={TextFieldAppearance.filled} />);
            shallow(<TextField appearance={TextFieldAppearance.outline} />);
        }).not.toThrow();
    });

    test("should apply a 'filled' html class when appearance is filled", () => {
        const rendered: any = mount(
            <TextField
                appearance={TextFieldAppearance.filled}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("input").prop("className")).toContain(
            managedClasses.textField__filled
        );
    });

    test("should apply an 'outline' html class when appearance is outline", () => {
        const rendered: any = mount(
            <TextField
                appearance={TextFieldAppearance.outline}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("input").prop("className")).toContain(
            managedClasses.textField__outline
        );
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: TextFieldHandledProps = {
            managedClasses,
        };

        const unhandledProps: TextFieldUnhandledProps = {
            "aria-hidden": true,
        };
        const props: TextFieldProps = { ...handledProps, ...unhandledProps };
        const rendered: any = mount(<TextField {...props} />);

        expect(rendered.find("input").prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.find("input").prop("aria-hidden")).toEqual(true);
    });

    test("should set a default type of `text` on inner input", () => {
        const rendered: any = mount(<TextField managedClasses={managedClasses} />);

        expect(rendered.find("input").prop("type")).not.toBe(undefined);
        expect(rendered.find("input").prop("type")).toEqual("text");
    });

    test("should NOT render with a disabled value if no `disabled` prop is passed", () => {
        const rendered: any = mount(<TextField managedClasses={managedClasses} />);

        expect(rendered.find("input").prop("disabled")).toBe(undefined);
    });

    test("should render with a `disabled` value when `disabled` prop is passed", () => {
        const rendered: any = mount(
            <TextField managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.find("input").prop("disabled")).toBe(true);
    });

    test("should NOT render with a placeholder value if no `placeholder` prop is passed", () => {
        const rendered: any = mount(<TextField managedClasses={managedClasses} />);

        expect(rendered.find("input").prop("placeholder")).toBe(undefined);
    });

    test("should render with a placeholder value when `placeholder` prop is passed", () => {
        const rendered: any = mount(
            <TextField managedClasses={managedClasses} placeholder={"Test"} />
        );

        expect(rendered.find("input").prop("placeholder")).toEqual("Test");
    });
});
