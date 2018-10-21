import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import {
    generateSnapshots,
    SnapshotTestSuite,
} from "@microsoft/fast-jest-snapshots-react";
import MSFTHeading, {
    HeadingHandledProps,
    HeadingSize,
    HeadingTag,
    HeadingUnhandledProps,
} from "./heading";
import { Typography } from "@microsoft/fast-components-react-base";
import { Heading, HeadingProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("heading snapshots", (): void => {
    generateSnapshots(examples as SnapshotTestSuite<HeadingProps>);
});

describe("heading", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTHeading as any).name).toBe(MSFTHeading.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTHeading tag={HeadingTag.h1} />);
            shallow(<MSFTHeading tag={HeadingTag.h1} size={HeadingSize._1} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: HeadingHandledProps = {
            tag: HeadingTag.h1,
            size: HeadingSize._1,
        };

        const unhandledProps: HeadingUnhandledProps = {
            "aria-hidden": true,
        };

        const props: HeadingHandledProps & HeadingUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<Heading {...props} />);

        expect(rendered.find(handledProps.tag).prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h3} />);

        expect(rendered.exists(HeadingTag.h3)).toBe(true);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = mount(<Heading tag={HeadingTag.p} size={HeadingSize._2} />);

        expect(rendered.find("p").prop("className")).toContain("heading__2");
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(
            <MSFTHeading tag={HeadingTag.p}>Children</MSFTHeading>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
