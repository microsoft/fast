import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow, ShallowWrapper } from "enzyme";
import examples from "./examples.data";
import Divider, {
    DividerClassNameContract,
    DividerHandledProps,
    DividerManagedClasses,
    DividerProps,
    DividerRoles,
    DividerUnhandledProps,
} from "./divider";

configure({ adapter: new Adapter() });

describe("divider", (): void => {
    const managedClasses: DividerClassNameContract = {
        divider: "divider-class",
    };

    test("should have a displayName that matches the component name", () => {
        expect((Divider as any).name).toBe(Divider.displayName);
    });

    test("should have correct root element type 'hr'", () => {
        const rendered: ShallowWrapper = shallow(<Divider />);
        expect(rendered.type()).toBe("hr");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Divider />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: DividerHandledProps = {
            managedClasses,
        };
        const unhandledProps: DividerUnhandledProps = {
            "aria-hidden": true,
        };
        const props: DividerProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<Divider {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should pass `role` prop when value is `presentation`", () => {
        const rendered: any = shallow(
            <Divider managedClasses={managedClasses} role={DividerRoles.presentation} />
        );

        expect(rendered.prop("role")).toEqual(DividerRoles.presentation);
    });

    test("should NOT have a role attribute when value is `separator`", () => {
        const rendered: any = shallow(
            <Divider managedClasses={managedClasses} role={DividerRoles.separator} />
        );

        expect(rendered.prop("role")).not.toEqual(DividerRoles.separator);
        expect(rendered.prop("role")).toBe(undefined);
    });
});
