import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Typography, {
    ITypographyClassNameContract,
    ITypographyHandledProps,
    ITypographyManagedClasses,
    ITypographyUnhandledProps,
    TypographyProps,
    TypographySize,
    TypographyTag
} from "./typography";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("typography snapshot", (): void => {
    generateSnapshots(examples);
});

describe("typography", (): void => {
    const managedClasses: ITypographyClassNameContract = {
        typography__1: "typography-1-class",
        typography__2: "typography-2-class",
        typography__3: "typography-3-class",
        typography__4: "typography-4-class",
        typography__5: "typography-5-class",
        typography__6: "typography-6-class",
        typography__7: "typography-7-class",
        typography__8: "typography-8-class",
        typography__9: "typography-9-class"
    };

    test("should have a displayName that matches the component name", () => {
        expect((Typography as any).name).toBe(Typography.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<Typography />);
                shallow(<Typography size={TypographySize._1} />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ITypographyHandledProps & ITypographyManagedClasses = {
            managedClasses
        };
        const unhandledProps: ITypographyUnhandledProps = {
            "aria-hidden": true
        };
        const props: TypographyProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Typography {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should render with a default tag of `p` if no `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} />
        );

        expect(rendered.prop("tag")).toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.p);
        expect(rendered.type()).toEqual(TypographyTag.p);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses} tag={TypographyTag.h1} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h1);
        expect(rendered.type()).toEqual(TypographyTag.h1);
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(
            <Typography managedClasses={managedClasses}>
                Children
            </Typography>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
