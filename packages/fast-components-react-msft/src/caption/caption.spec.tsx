import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTCaption, {
    CaptionProps,
    CaptionSize,
    CaptionTag,
    ICaptionHandledProps,
    ICaptionManagedClasses,
    ICaptionUnhandledProps
} from "./caption";
import { Caption } from "./index";

/**
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("caption snapshots", (): void => {
    generateSnapshots(examples);
});

describe("caption", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTCaption as any).name).toBe(MSFTCaption.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTCaption />);
            }
        ).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: ICaptionHandledProps = {
            tag: CaptionTag.p,
            size: CaptionSize._1
        };

        const unhandledProps: ICaptionUnhandledProps = {
            "aria-hidden": true
        };

        const props: ICaptionHandledProps & ICaptionUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = mount(
            <Caption {...props} />
        );

        expect(rendered.find(handledProps.tag).prop("aria-hidden")).toEqual(true);
    });

    test("should render a default `tag` of `CaptionTag.p` if no `tag` prop is passed", () => {
        const rendered: any = mount(
            <MSFTCaption />
        );

        expect(rendered.prop("tag")).toEqual(CaptionTag.p);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = mount(
            <Caption size={CaptionSize._2} />
        );

        expect(rendered.find("p").prop("className")).toContain("caption__2");
    });
});
