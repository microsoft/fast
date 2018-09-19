import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
<<<<<<< HEAD
import MSFTCaption, {
    CaptionLevel,
=======
import {
>>>>>>> updates any breaking changes props and subsequent data
    CaptionProps,
    CaptionSize
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

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ICaptionHandledProps = {
            tag: CaptionTag.p,
            size: CaptionSize._1
        };

        const unhandledProps: ICaptionUnhandledProps = {
            "aria-hidden": true
        };

        const props: ICaptionHandledProps & ICaptionUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Caption {...props} />
        );

        const caption: any = rendered.first().shallow();

        expect(caption.prop("aria-hidden")).toEqual(true);
    });

    test("should render a default `tag` of `CaptionTag.p` if no `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Caption />
        );
        const caption: any = rendered.first().shallow();

        expect(caption.instance().props.tag).toEqual(CaptionTag.p);
    });

    test("should render the correct `level` when `level` prop is passed", () => {
        const rendered: any = shallow(
            <Component level={CaptionSize._2} />
        );
        const caption: any = rendered.first().shallow();

        expect(caption.instance().props.level).toEqual(CaptionSize._2);
    });
});
