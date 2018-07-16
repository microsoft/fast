import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    DividerProps,
    DividerRoles,
    IDividerClassNameContract,
    IDividerHandledProps,
    IDividerManagedClasses,
    IDividerUnhandledProps
} from "./divider";

describe("divider", (): void => {
    generateSnapshots(examples);
});

configure({adapter: new Adapter()});

describe("divider unit-tests", (): void => {
    let Component: React.ComponentClass<IDividerHandledProps & IDividerManagedClasses>;
    let managedClasses: IDividerClassNameContract;

    beforeEach(() => {
        Component = examples.component;
        managedClasses = {
            divider: "divider-class",
        };
    });

    test("should correctly manage unhandledProps", () => {
        const handledProps: IDividerHandledProps & IDividerManagedClasses = {
            managedClasses
        };
        const unhandledProps: IDividerUnhandledProps = {
            "aria-hidden": true
        };
        const props: DividerProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should correctly pass `role` prop when value is `presentation`", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} role={DividerRoles.presentation} />
        );

        expect(rendered.prop("role")).toEqual(DividerRoles.presentation);
    });

    test("should NOT pass `role` prop when value is `separator`", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} role={DividerRoles.separator} />
        );

        expect(rendered.prop("role")).not.toEqual(DividerRoles.separator);
        expect(rendered.prop("role")).toBe(undefined);
    });
});
