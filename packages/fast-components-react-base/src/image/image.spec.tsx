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
        const rendered: any = shallow(
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

    test("should correctly render an `<img/>` element if `src` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} alt={alt} src={"https://placehold.it/20x20"} />
        );

        expect(rendered.type()).toBe("img");
    });

    test("should correctly render a `<Picture>` element if `vp` props are passed", () => {
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
