import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTSubheading, {
    SubheadingHandledProps,
    SubheadingManagedClasses,
    SubheadingSize,
    SubheadingTag,
    SubheadingUnhandledProps,
} from "./subheading";
import { Subheading, SubheadingProps } from "./index";
import { TypographySize } from "../typography";
import { DisplayNamePrefix } from "../utilities";

/**
 * Configure enzyme
 */
configure({ adapter: new Adapter() });

describe("subheading", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTSubheading as any).name}`).toBe(
            MSFTSubheading.displayName
        );
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

    test("should render as an `h1` element when `SubheadingTag.h1` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.h1} />);

        expect(rendered.exists(SubheadingTag.h1)).toBe(true);
    });

    test("should render as an `h2` element when `SubheadingTag.h2` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.h2} />);

        expect(rendered.exists(SubheadingTag.h2)).toBe(true);
    });

    test("should render as an `h3` element when `SubheadingTag.h3` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.h3} />);

        expect(rendered.exists(SubheadingTag.h3)).toBe(true);
    });

    test("should render as an `h4` element when `SubheadingTag.h4` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.h4} />);

        expect(rendered.exists(SubheadingTag.h4)).toBe(true);
    });

    test("should render as an `h5` element when `SubheadingTag.h5` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.h5} />);

        expect(rendered.exists(SubheadingTag.h5)).toBe(true);
    });

    test("should render as an `h6` element when `SubheadingTag.h6` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.h6} />);

        expect(rendered.exists(SubheadingTag.h6)).toBe(true);
    });

    test("should render as a `p` element when `SubheadingTag.p` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTSubheading tag={SubheadingTag.p} />);

        expect(rendered.exists(SubheadingTag.p)).toBe(true);
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
