import React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import Typography, {
    TypographyClassNameContract,
    TypographyHandledProps,
    TypographyManagedClasses,
    TypographyProps,
    TypographySize,
    TypographyTag,
    TypographyUnhandledProps,
} from "./typography";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("typography", (): void => {
    const managedClasses: TypographyClassNameContract = {
        typography__1: "typography-1-class",
        typography__2: "typography-2-class",
        typography__3: "typography-3-class",
        typography__4: "typography-4-class",
        typography__5: "typography-5-class",
        typography__6: "typography-6-class",
        typography__7: "typography-7-class",
        typography__8: "typography-8-class",
        typography__9: "typography-9-class",
    };

    test("should have a displayName that matches the component name", () => {
        expect((Typography as any).name).toBe(Typography.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Typography />);
            shallow(<Typography size={TypographySize._1} />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: TypographyHandledProps & TypographyManagedClasses = {
            managedClasses,
        };
        const unhandledProps: TypographyUnhandledProps = {
            "aria-hidden": true,
        };
        const props: TypographyProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<Typography {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should render with a default tag of `p` if no `tag` prop is passed", () => {
        const rendered: any = shallow(<Typography managedClasses={managedClasses} />);

        expect(rendered.prop("tag")).toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.p);
        expect(rendered.type()).toEqual(TypographyTag.p);
    });

    test("should render as an `h1` element when `TypographyTag.h1` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h1} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h1);
        expect(rendered.type()).toEqual(TypographyTag.h1);
    });

    test("should render as an `h2` element when `TypographyTag.h2` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h2} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h2);
        expect(rendered.type()).toEqual(TypographyTag.h2);
    });

    test("should render as an `h3` element when `TypographyTag.h3` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h3} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h3);
        expect(rendered.type()).toEqual(TypographyTag.h3);
    });

    test("should render as an `h4` element when `TypographyTag.h4` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h4} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h4);
        expect(rendered.type()).toEqual(TypographyTag.h4);
    });

    test("should render as an `h5` element when `TypographyTag.h5` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h5} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h5);
        expect(rendered.type()).toEqual(TypographyTag.h5);
    });

    test("should render as an `h6` element when `TypographyTag.h6` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h6} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h6);
        expect(rendered.type()).toEqual(TypographyTag.h6);
    });

    test("should render as a `p` element when `TypographyTag.p` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.p} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.p);
        expect(rendered.type()).toEqual(TypographyTag.p);
    });

    test("should render as a `span` element when `TypographyTag.span` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.span} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.span);
        expect(rendered.type()).toEqual(TypographyTag.span);
    });

    test("should render as a `figcaption` element when `TypographyTag.figcaption` is passed to the `tag` prop", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.figcaption} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.figcaption);
        expect(rendered.type()).toEqual(TypographyTag.figcaption);
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses}>Children</Typography>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
