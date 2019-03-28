import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTHeading, {
    HeadingHandledProps,
    HeadingSize,
    HeadingTag,
    HeadingUnhandledProps,
} from "./heading";
import { Typography } from "@microsoft/fast-components-react-base";
import { Heading, HeadingProps } from "./index";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("heading", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTHeading as any).name}`).toBe(
            MSFTHeading.displayName
        );
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

    test("should render a default `tag` when no `tag` prop is passed", () => {
        const rendered: any = mount(<MSFTHeading />);

        expect(rendered.exists(HeadingTag.h1)).toBe(true);
    });

    test("should render as an `h1` element when `HeadingTag.h1` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h1} />);

        expect(rendered.exists(HeadingTag.h1)).toBe(true);
    });

    test("should render as an `h2` element when `HeadingTag.h2` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h2} />);

        expect(rendered.exists(HeadingTag.h2)).toBe(true);
    });

    test("should render as an `h3` element when `HeadingTag.h3` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h3} />);

        expect(rendered.exists(HeadingTag.h3)).toBe(true);
    });

    test("should render as an `h4` element when `HeadingTag.h4` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h4} />);

        expect(rendered.exists(HeadingTag.h4)).toBe(true);
    });

    test("should render as an `h5` element when `HeadingTag.h5` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h5} />);

        expect(rendered.exists(HeadingTag.h5)).toBe(true);
    });

    test("should render as an `h6` element when `HeadingTag.h6` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.h6} />);

        expect(rendered.exists(HeadingTag.h6)).toBe(true);
    });

    test("should render as a `p` element when `HeadingTag.p` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTHeading tag={HeadingTag.p} />);

        expect(rendered.exists(HeadingTag.p)).toBe(true);
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
