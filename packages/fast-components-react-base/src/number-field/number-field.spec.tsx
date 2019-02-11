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

    test("should return an HTML `textarea` element", () => {
        // const rendered: any = shallow(<NumberField managedClasses={...managedClasses} />);

        expect(rendered.find("textarea").length).toBe(1);
    });
});
