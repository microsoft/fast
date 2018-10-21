import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite,
} from "@microsoft/fast-jest-snapshots-react";
import MSFTSubheading, {
    SubheadingHandledProps,
    SubheadingManagedClasses,
    SubheadingSize,
    SubheadingTag,
    SubheadingUnhandledProps,
} from "./subheading";
import { Subheading, SubheadingProps } from "./index";
import { TypographySize } from "../typography";

/**
 * Configure enzyme
 */
configure({ adapter: new Adapter() });

describe("subheading", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTSubheading as any).name).toBe(MSFTSubheading.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTSubheading />);
            shallow(<MSFTSubheading size={SubheadingSize._1} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", (): void => {
        const handledProps: SubheadingHandledProps = {
            tag: SubheadingTag.h1,
            size: SubheadingSize._1,
        };

        const unhandledProps: SubheadingUnhandledProps = {
            "aria-hidden": true,
        };

        const props: SubheadingHandledProps & SubheadingUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<MSFTSubheading {...props} />);

        expect(rendered.find(SubheadingTag.h1).prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed in", (): void => {
        const rendered: any = shallow(<MSFTSubheading tag={SubheadingTag.h4} />);

        expect(rendered.prop("tag")).toBe(SubheadingTag.h4);
    });

    test("should render default tag if none is specified", (): void => {
        const rendered: any = mount(<MSFTSubheading />);

        expect(rendered.prop("tag")).toBe(SubheadingTag.h3);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = mount(
            <Subheading tag={SubheadingTag.h1} size={SubheadingSize._2} />
        );

        expect(rendered.find("h1").prop("className")).toContain("subheading__2");
    });

    test("should render default size if none is specified", (): void => {
        const rendered: any = mount(<MSFTSubheading />);

        expect(rendered.prop("size")).toBe(SubheadingSize._1);
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(<MSFTSubheading>Children</MSFTSubheading>);

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
