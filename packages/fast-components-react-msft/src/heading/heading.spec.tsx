import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTHeading, {
    HeadingProps,
    HeadingSize,
    HeadingTag,
    IHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading";
import { Typography } from "@microsoft/fast-components-react-base";
import { Heading } from "./index";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("heading snapshots", (): void => {
    generateSnapshots(examples);
});

describe("heading", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTHeading as any).name).toBe(MSFTHeading.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTHeading tag={HeadingTag.h1} />);
                shallow(<MSFTHeading tag={HeadingTag.h1} size={HeadingSize._1} />);
            }
        ).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: IHeadingHandledProps = {
            tag: HeadingTag.h1,
            size: HeadingSize._1
        };

        const unhandledProps: IHeadingUnhandledProps = {
            "aria-hidden": true
        };

        const props: IHeadingHandledProps & IHeadingUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = mount(
            <Heading {...props} />
        );

        expect(rendered.find(handledProps.tag).prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = mount(
            <MSFTHeading tag={HeadingTag.h3} />
        );

        expect(rendered.exists(HeadingTag.h3)).toBe(true);
    });
});
