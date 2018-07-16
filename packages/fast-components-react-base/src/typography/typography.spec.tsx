import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    ITypographyClassNameContract,
    ITypographyHandledProps,
    ITypographyManagedClasses,
    ITypographyUnhandledProps,
    TypographyProps,
    TypographyTag
} from "./typography";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("typography", (): void => {
    generateSnapshots(examples);
});

describe("typography unit-tests", (): void => {
    let Component: React.ComponentClass<ITypographyHandledProps & ITypographyManagedClasses>;
    let managedClasses: ITypographyClassNameContract;

    beforeEach(() => {
        Component = examples.component;
        managedClasses = {
            typography_1: "typography-1-class",
            typography_2: "typography-2-class",
            typography_3: "typography-3-class",
            typography_4: "typography-4-class",
            typography_5: "typography-5-class",
            typography_6: "typography-6-class",
            typography_7: "typography-7-class",
            typography_8: "typography-8-class",
            typography_9: "typography-9-class"
        };
    });

    test("should correctly manage unhandledProps", () => {
        const handledProps: ITypographyHandledProps & ITypographyManagedClasses = {
            managedClasses
        };
        const unhandledProps: ITypographyUnhandledProps = {
            "aria-hidden": true
        };
        const props: TypographyProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should render with a default tag of `p` if no `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        expect(rendered.prop("tag")).toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.p);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} tag={TypographyTag.h1} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(TypographyTag.h1);
    });
});
