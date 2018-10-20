import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite,
} from "@microsoft/fast-jest-snapshots-react";
import Hypertext, {
    HypertextClassNameContract,
    HypertextHandledProps,
    HypertextManagedClasses,
    HypertextProps,
    HypertextUnhandledProps,
} from "./hypertext";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("hypertext", (): void => {
    const managedClasses: HypertextClassNameContract = {
        hypertext: "hypertext-class",
    };

    test("should have a displayName that matches the component name", () => {
        expect((Hypertext as any).name).toBe(Hypertext.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Hypertext />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: HypertextHandledProps & HypertextManagedClasses = {
            managedClasses,
        };

        const unhandledProps: HypertextUnhandledProps = {
            "aria-hidden": true,
        };

        const props: HypertextProps = { ...handledProps, ...unhandledProps };

        const rendered: any = shallow(<Hypertext {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should render with an attribute of `href` if `href` prop is passed", () => {
        const testHref: string = "http://www.microsoft.com";
        const rendered: any = shallow(
            <Hypertext href={testHref} managedClasses={managedClasses} />
        );

        expect(rendered.prop("href")).toBe(testHref);
    });

    test("should NOT render with an attribute of `href` if no `href` prop is passed", () => {
        const rendered: any = shallow(<Hypertext managedClasses={managedClasses} />);

        expect(rendered.prop("href")).toBe(null);
    });

    test("should correctly handle children", () => {
        const handledProps: HypertextHandledProps & HypertextManagedClasses = {
            managedClasses,
            href: "http://www.microsoft.com",
        };
        const rendered: any = shallow(
            <Hypertext managedClasses={managedClasses}>Children</Hypertext>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
