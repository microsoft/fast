import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTPivot, { PivotHandledProps, PivotUnhandledProps } from "./pivot";
import { PivotProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("pivot", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTPivot as any).name).toBe(MSFTPivot.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTPivot label="a label for testing" />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", (): void => {
        const handledProps: PivotHandledProps = {
            label: "Test",
        };

        const unhandledProps: PivotUnhandledProps = {
            "aria-hidden": true,
        };

        const props: PivotHandledProps & PivotUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<MSFTPivot {...props} />);

        expect(rendered.prop("aria-hidden")).toEqual(true);
    });
});
