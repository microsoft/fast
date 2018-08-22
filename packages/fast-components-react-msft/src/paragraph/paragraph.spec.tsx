import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphLevel,
    ParagraphProps,
} from "./paragraph";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("paragraph snapshots", (): void => {
    generateSnapshots(examples);
});

describe("paragraph", (): void => {
    const Component: React.ComponentClass<IParagraphHandledProps> = examples.component;

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IParagraphHandledProps = {
            level: ParagraphLevel._1
        };

        const unhandledProps: IParagraphUnhandledProps = {
            "aria-hidden": true
        };

        const props: IParagraphHandledProps & IParagraphUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        const paragraph: any = rendered.first().shallow();

        expect(paragraph.prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `level` when `level` prop is passed", () => {
        const rendered: any = shallow(
            <Component level={ParagraphLevel._2} />
        );
        const paragraph: any = rendered.first().shallow();

        expect(paragraph.instance().props.level).toEqual(ParagraphLevel._2);
    });
});
