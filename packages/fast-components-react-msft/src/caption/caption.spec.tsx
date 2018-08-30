import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    CaptionLevel,
    CaptionProps,
    CaptionTag,
    ICaptionHandledProps,
    ICaptionManagedClasses,
    ICaptionUnHandledProps
} from "./caption";

/**
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("caption snapshots", (): void => {
    generateSnapshots(examples);
});

describe("caption", (): void => {
    const Component: React.ComponentClass<ICaptionHandledProps> = examples.component;

    test("should render a default `tag` of `CaptionTag.p` if no `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Component />
        );
        const caption: any = rendered.first().shallow();

        expect(caption.instance().props.tag).toEqual(CaptionTag.p);
    });

    test("should render the correct `level` when `level` prop is passed", () => {
        const rendered: any = shallow(
            <Component level={CaptionLevel._2} />
        );
        const caption: any = rendered.first().shallow();

        expect(caption.instance().props.level).toEqual(CaptionLevel._2);
    });
});
