import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    IImageClassNameContract,
    IImageHandledProps,
    IImageManagedClasses,
    IImageUnhandledProps,
    ImageProps,
} from "./image";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("image snapshot", (): void => {
    generateSnapshots(examples);
});

describe("image", (): void => {
    const Component: React.ComponentClass<IImageHandledProps & IImageManagedClasses> = examples.component;
    const managedClasses: IImageClassNameContract = {
        image: "image-class",
        image__picture: "picture-class"
    };
    const alt: string = "Image alt text test string";

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IImageHandledProps & IImageManagedClasses = {
            managedClasses,
            alt,
            src: "https://placehold.it/200x200"
        };
        const unhandledProps: IImageUnhandledProps = {
            "aria-hidden": true
        };
        const props: ImageProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should correctly NOT render anything if `src` and `vp1` props are both undefined", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} />
        );

        expect(rendered.type()).toEqual(null);
    });

    test("should render an `<img />` element if `src` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} src={"https://placehold.it/20x20"} />
        );

        expect(rendered.type()).toBe("img");
    });

    test("should render a `<picture>` element if `vp1` and any additional `vp2`, `vp3`, `vp4`, `vp5`, `vp6` props are passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} vp1={"https://placehold.it/20x20"} />
        );

        expect(rendered.type()).toBe("picture");
    });

    test("should NOT render with a srcset value if no `srcSet` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} src={"https://placehold.it/20x20"} />
        );

        expect(rendered.prop("srcSet")).toBe(null);
    });

    test("should render with a srcset value when `srcSet` prop is passed", () => {
        const rendered: any = shallow(
            <Component
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/20x20"}
                srcSet={"https://placehold.it/20x20/ 767w, https://placehold.it/40x40/ 1w"}
            />
        );

        expect(rendered.prop("srcSet")).toBe("https://placehold.it/20x20/ 767w, https://placehold.it/40x40/ 1w");
    });

    test("should NOT render with a sizes value if no `sizes` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} src={"https://placehold.it/20x20"} />
        );

        expect(rendered.prop("sizes")).toBe(null);
    });

    test("should render with a sizes value when `sizes` prop is passed", () => {
        const rendered: any = shallow(
            <Component
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/400x400"}
                sizes={"100vw"}
            />
        );

        expect(rendered.prop("sizes")).toBe("100vw");
    });

    test("should only render `<srcset />` elements to picture if `vp` prop instances are present", () => {
        const props: IImageHandledProps & IImageManagedClasses = {
            managedClasses,
            alt,
            vp1: "https://placehold.it/80x80",
            vp2: "https://placehold.it/100x100"
        };
        const rendered: any = shallow(
            <Component {...props}/>
        );

        expect(rendered.instance().props.vp1).toEqual(props.vp1);
        expect(rendered.instance().props.vp2).toEqual(props.vp2);
        expect(rendered.instance().props.vp3).toBe(undefined);
        expect(rendered.instance().props.vp4).toBe(undefined);
        expect(rendered.instance().props.vp5).toBe(undefined);
        expect(rendered.instance().props.vp6).toBe(undefined);
    });
});
