import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { IImageClassNameContract } from "./image";
import {
    IImageHandledProps,
    IImageManagedClasses,
    IImageUnhandledProps,
    ImageProps,
} from "./image.props";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("image", (): void => {
    generateSnapshots(examples);
});

describe("image unit-tests", (): void => {
    let Component: React.ComponentClass<IImageHandledProps & IImageManagedClasses>;
    let managedClasses: IImageClassNameContract;
    let alt: string;

    beforeEach(() => {
        alt = "Image alt text test string";
        Component = examples.component;
        managedClasses = {
            image: "image-class",
            image_round: "image-round",
            picture: "picture"
        };
    });

    test("should correctly manage unhandledProps", () => {
        const handledProps: IImageHandledProps & IImageManagedClasses = {
            managedClasses,
            alt,
            src: "https://placehold.it/200x200"
        };
        const unhandledProps: IImageUnhandledProps = {
            "aria-hidden": true
        };
        const props: ImageProps = {...handledProps, ...unhandledProps};
        const rendered: any = mount(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should correctly NOT render anything if `src` and `vp1` props are both undefined", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} />
        );

        expect(rendered.type()).toEqual(null);
    });
});
