import React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import Image, {
    ImageClassNameContract,
    ImageHandledProps,
    ImageManagedClasses,
    ImageProps,
    ImageSlot,
    ImageUnhandledProps,
} from "./image";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("image", (): void => {
    const managedClasses: ImageClassNameContract = {
        image: "image-class",
        image__picture: "picture-class",
    };
    const alt: string = "Image alt text test string";

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(Image as any).name}`).toBe(Image.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Image alt="alt" />);
            shallow(
                <Image alt="alt">
                    <source slot={ImageSlot.source} />
                </Image>
            );
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ImageHandledProps = {
            managedClasses,
            alt,
            src: "https://placehold.it/200x200",
        };
        const unhandledProps: ImageUnhandledProps = {
            "aria-hidden": true,
        };
        const props: ImageProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<Image {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should render an `<img />` element if `src` prop is passed", () => {
        const rendered: any = shallow(
            <Image
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/20x20"}
            />
        );

        expect(rendered.type()).toBe("img");
    });

    test("should render a `<picture>` element if children with the prop of `slot='source'` are passed", () => {
        const rendered: any = shallow(
            <Image managedClasses={managedClasses} alt={alt}>
                <source slot={ImageSlot.source} />
            </Image>
        );

        expect(rendered.type()).toBe("picture");
    });

    test("should NOT render with a srcset value if no `srcSet` prop is passed", () => {
        const rendered: any = shallow(
            <Image
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/20x20"}
            />
        );

        expect(rendered.prop("srcSet")).toBe(null);
    });

    test("should render with a srcset value when `srcSet` prop is passed", () => {
        const rendered: any = shallow(
            <Image
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/20x20"}
                srcSet={
                    "https://placehold.it/20x20/ 767w, https://placehold.it/40x40/ 1w"
                }
            />
        );

        expect(rendered.prop("srcSet")).toBe(
            "https://placehold.it/20x20/ 767w, https://placehold.it/40x40/ 1w"
        );
    });

    test("should NOT render with a sizes value if no `sizes` prop is passed", () => {
        const rendered: any = shallow(
            <Image
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/20x20"}
            />
        );

        expect(rendered.prop("sizes")).toBe(null);
    });

    test("should render with a sizes value when `sizes` prop is passed", () => {
        const rendered: any = shallow(
            <Image
                managedClasses={managedClasses}
                alt={alt}
                src={"https://placehold.it/400x400"}
                sizes={"100vw"}
            />
        );

        expect(rendered.prop("sizes")).toBe("100vw");
    });

    // parametrized image class name tests
    [
        {
            name: "should correctly assign empty className",
            imageHandledProps: {} as ImageHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className with root className",
            imageHandledProps: {} as ImageHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name: "should correctly assign className with root className and input props",
            imageHandledProps: {
                managedClasses: {
                    image: "image-class",
                    image__picture: "picture-class",
                },
            } as ImageHandledProps,
            className: "class-name",
            expectedClassName: "image-class picture-class class-name",
        },
    ].forEach(({ name, imageHandledProps, className, expectedClassName }: any) => {
        test(name, () => {
            const props: ImageProps = { ...imageHandledProps };
            const rendered: any = shallow(
                <Image {...props} className={className}>
                    <source slot={ImageSlot.source} />
                </Image>
            );

            expect(rendered.prop("className")).toEqual(expectedClassName);
        });
    });
});
