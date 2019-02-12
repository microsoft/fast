import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import NumberField, {
    NumberFieldHandledProps,
    NumberFieldManagedClasses,
    NumberFieldProps,
    NumberFieldUnhandledProps,
} from "./";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: NumberFieldManagedClasses = {
    managedClasses: {
        numberField: "number-field",
    },
};

describe("number field", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((NumberField as any).name).toBe(NumberField.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<NumberField />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: NumberFieldHandledProps = {
            ...managedClasses,
        };

        const unhandledProps: NumberFieldUnhandledProps = {
            "aria-hidden": true,
        };
        const props: NumberFieldProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<NumberField {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should return an HTML `input` element", () => {
        const rendered: any = shallow(<NumberField />);

        expect(rendered.find("input").length).toBe(1);
    });

    test("should be disabled if prop passed", () => {
        const rendered: any = shallow(<NumberField disabled={true} />);

        expect(rendered.find("input").prop("disabled")).toEqual(true);
    });

    test("should be required if prop passed", () => {
        const rendered: any = shallow(<NumberField required={true} />);

        expect(rendered.find("input").prop("required")).toEqual(true);
    });

    test("should be readOnly if prop passed", () => {
        const rendered: any = shallow(<NumberField readOnly={true} />);

        expect(rendered.find("input").prop("readOnly")).toEqual(true);
    });

    test("should set min numerical value if prop passed", () => {
        const rendered: any = shallow(<NumberField min={0} />);

        expect(rendered.find("input").prop("min")).toEqual(0);
    });

    test("should set max numerical value if prop passed", () => {
        const rendered: any = shallow(<NumberField max={10} />);

        expect(rendered.find("input").prop("max")).toEqual(10);
    });

    test("should set step numerical value if prop passed", () => {
        const rendered: any = shallow(<NumberField step={0.1} />);

        expect(rendered.find("input").prop("step")).toEqual(0.1);
    });

    test("should set name if prop passed", () => {
        const rendered: any = shallow(<NumberField name={"Name"} />);

        expect(rendered.find("input").prop("name")).toEqual("Name");
    });

    test("should set placeholder if prop passed", () => {
        const rendered: any = shallow(<NumberField placeholder={"Placeholder"} />);

        expect(rendered.find("input").prop("placeholder")).toEqual("Placeholder");
    });
});
