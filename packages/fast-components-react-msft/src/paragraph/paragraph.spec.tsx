import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTParagraph, {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphProps,
    ParagraphSize,
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
                shallow(<Paragraph size={ParagraphSize._1} />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IParagraphHandledProps = {
            size: ParagraphSize._1
        };

        const unhandledProps: IParagraphUnhandledProps = {
            "aria-hidden": true
        };

        const props: IParagraphHandledProps & IParagraphUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = mount(
            <Paragraph {...props} />
        );

        expect(rendered.exists("[aria-hidden]")).toEqual(true);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = mount(
            <Paragraph size={ParagraphSize._2} />
        );

        expect(rendered.find("p").prop("className")).toContain("paragraph__2");
    });

    test("should render a default `size` of `ParagraphSize._3` if no `size` prop is passed", () => {
        const rendered: any = mount(
            <Paragraph />
        );

        expect(rendered.find("p").prop("className")).toContain("paragraph__3");
    });
});
