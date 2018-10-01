import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTParagraph, {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphLevel,
    ParagraphProps,
} from "./paragraph";
import { Paragraph } from "./index";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("paragraph snapshots", (): void => {
    generateSnapshots(examples);
});

describe("paragraph", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTParagraph as any).name).toBe(MSFTParagraph.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<Paragraph />);
                shallow(<Paragraph size={ParagraphLevel._1} />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IParagraphHandledProps = {
            size: ParagraphLevel._1
        };

        const unhandledProps: IParagraphUnhandledProps = {
            "aria-hidden": true
        };

        const props: IParagraphHandledProps & IParagraphUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Paragraph {...props} />
        );

        const paragraph: any = rendered.first().shallow();

        expect(paragraph.prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = shallow(
            <Paragraph size={ParagraphLevel._2} />
        );
        const paragraph: any = rendered.first().shallow();

        expect(paragraph.instance().props.size).toEqual(ParagraphLevel._2);
    });

    test("should render a default `size` of `ParagraphLevel._3` if no `size` prop is passed", () => {
        const rendered: any = shallow(
            <Paragraph />
        );
        const paragraph: any = rendered.first().shallow();

        expect(paragraph.instance().props.size).toEqual(ParagraphLevel._3);
    });
});
