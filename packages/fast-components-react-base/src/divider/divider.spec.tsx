import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Divider, {
    DividerProps,
    DividerRoles,
    IDividerClassNameContract,
    IDividerHandledProps,
    IDividerManagedClasses,
    IDividerUnhandledProps
} from "./divider";

describe("divider snapshot", (): void => {
    generateSnapshots(examples);
});

configure({adapter: new Adapter()});

describe("divider", (): void => {
    const managedClasses: IDividerClassNameContract = {
        divider: "divider-class",
    };

    test("should have a displayName that matches the component name", () => {
        expect((Divider as any).name).toBe(Divider.displayName);
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IDividerHandledProps & IDividerManagedClasses = {
            managedClasses
        };
        const unhandledProps: IDividerUnhandledProps = {
            "aria-hidden": true
        };
        const props: DividerProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Divider {...props} />
        );

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
