import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    HeadingLevel,
    HeadingProps,
    HeadingTag,
    IHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading";
import { Typography } from "@microsoft/fast-components-react-base";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("heading snapshot", (): void => {
    generateSnapshots(examples);
});

describe("heading", (): void => {
    const Component: React.ComponentClass<IHeadingHandledProps> = examples.component;

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IHeadingHandledProps = {
            tag: HeadingTag.h1,
            level: HeadingLevel._1
        };

        const unhandledProps: IHeadingUnhandledProps = {
            "aria-hidden": true
        };

        const props: IHeadingHandledProps & IHeadingUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        const heading: any = rendered.first().shallow();

        expect(heading.prop("aria-hidden")).not.toBe(undefined);
        expect(heading.prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Component tag={HeadingTag.h3} />
        );
        const heading: any = rendered.first().shallow();

        expect(heading.instance().props.tag).not.toBe(undefined);
        expect(heading.instance().props.tag).toEqual(HeadingTag.h3);
    });

    test("should return an instance of the typography component", () => {
        const rendered: any = shallow(
            <Component tag={HeadingTag.h3} />
        );
        const heading: any = rendered.first().shallow();

        expect(heading.first().shallow().type()).toEqual(Typography);
    });
});
