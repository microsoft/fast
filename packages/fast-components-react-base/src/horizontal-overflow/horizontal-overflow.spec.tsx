import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import HorizontalOverflow, {
    ButtonDirection,
    IHorizontalOverflowClassNameContract
} from "./";
import examples from "./examples.data";
import "raf/polyfill";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

const imageSet1: JSX.Element[] = [
    (<img key="image1" src="https://placehold.it/200x200?text=1" />),
    (<img key="image2" src="https://placehold.it/200x200?text=2" />),
    (<img key="image3" src="https://placehold.it/200x200?text=3" />),
    (<img key="image4" src="https://placehold.it/200x200?text=4" />),
    (<img key="image5" src="https://placehold.it/200x200?text=5" />),
    (<img key="image6" src="https://placehold.it/200x200?text=6" />)
];

const managedClasses: IHorizontalOverflowClassNameContract = {
    horizontalOverflow: "horizontal-overflow-class",
    horizontalOverflow_items: "horizontal-overflow-items-class",
    horizontalOverflow_next: "horizontal-overflow-next-class",
    horizontalOverflow_previous: "horizontal-overflow-previous-class"
};

describe("horizontal overflow snapshot", (): void => {
    generateSnapshots(examples);
});

// TODO #746: https://github.com/Microsoft/fast-dna/issues/746

/* tslint:disable:no-string-literal */
describe("horizontal overflow", (): void => {
    test("should render a previous button if one is passed as a child with the appropriate slot prop", () => {
        const renderedWithImagesAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndPrevious.find("#testButtonPrevious")).not.toBe(undefined);
    });
    test("should render a next button if one is passed as a child with the appropriate slot prop", () => {
        const renderedWithImagesAndNext: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndNext.find("#testButtonNext")).not.toBe(undefined);
    });
    test("should render a series of items if they are passed as children", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.find("img").length).toBe(6);
    });
    test("should not set `itemHeight` if no children have been passed", () => {
        const rendered: any = mount(
            <HorizontalOverflow managedClasses={managedClasses} />
        );

        expect(rendered.state("itemsHeight")).toBe(0);
    });
    test("should update the rendering of a series of items if they are modified", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.find("img").length).toBe(6);

        renderedWithImages.setProps({ children: [
            (<img key="image1" src="https://placehold.it/200x200?text=1" />),
            (<img key="image2" src="https://placehold.it/200x200?text=2" />)
        ]});

        expect(renderedWithImages.find("img").length).toBe(2);
    });
    test("should update the scrolled distance when moving next to include the next number of items that can be in view", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages.instance()[
                "getScrollDistanceFromDirection"
            ](
                ButtonDirection.next,
                50,
                [10, 20, 20, 50, 20],
                0
            )
        ).toBe(50);

        // reaches the max distance and uses that instead
        expect(
            renderedWithImages.instance()[
                "getScrollDistanceFromDirection"
            ](
                ButtonDirection.next,
                40,
                [10, 20, 10, 30, 20, 10],
                30
            )
        ).toBe(60);

        expect(
            renderedWithImages.instance()[
                "getScrollDistanceFromDirection"
            ](
                ButtonDirection.next,
                40,
                [10, 20, 10, 30, 20, 10, 20, 10],
                30
            )
        ).toBe(70);

        expect(
            renderedWithImages.instance()[
                "getScrollDistanceFromDirection"
            ](
                ButtonDirection.next,
                40,
                [10, 20, 10, 30, 20, 10, 20, 10],
                40
            )
        ).toBe(70);
    });
    test("should update the scrolled distance when moving previous to include the previous number of items that can be in view", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages.instance()[
                "getScrollDistanceFromDirection"
            ](
                ButtonDirection.previous,
                50,
                [10, 20, 20, 50, 20],
                10
            )
        ).toBe(0);

        expect(
            renderedWithImages.instance()[
                "getScrollDistanceFromDirection"
            ](
                ButtonDirection.previous,
                50,
                [50, 50, 50, 50],
                100
            )
        ).toBe(50);
    });
    test("should an state property `itemsHeight`", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.state("itemsHeight")).toBe(0);
        expect(
            renderedWithImages.instance()[
                "getItemMaxHeight"
            ]()
        ).toBe(0);
    });
    test("should ease the animation correctly when moving the scroll position", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages.instance()[
                "easeInOutQuad"
            ](
                1,
                0,
                0.5,
                50
            )
        ).toBe(0.0004);
    });
    test("should get the distance when moving next/previous", () => {
        const renderedWithImagesAndNextAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getNextDistance"
            ](500, [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190], 0)
        ).toBe(340);

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getNextDistance"
            ](500, [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190], 2100)
        ).toBe(2100);

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getPreviousDistance"
            ](500, [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190], 560)
        ).toBe(120);

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getPreviousDistance"
            ](500, [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190], 0)
        ).toBe(0);

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getScrollDistanceFromDirection"
            ]("next", 500, [], 0)
        ).toBe(0);
    });
    test("should set a max/min distance without additional calculations", () => {
        const renderedWithImagesAndNextAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getWithinMaxDistance"
            ](400, 500, [], 400)
        ).toBe(400);

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "getWithinMinDistance"
            ](0, 500, [])
        ).toBe(0);
    });
    test("should have an `onLoad` method", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow className="foo" managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages.instance()[
                "itemsOnLoad"
            ]()
        ).toBe(undefined);

        expect(renderedWithImages.instance().state.itemsHeight).toBe(0);

        renderedWithImages.setState({ itemsHeight: 50});

        expect(renderedWithImages.instance().state.itemsHeight).toBe(50);

        renderedWithImages.find("div.foo").simulate("load", {});

        expect(renderedWithImages.instance().state.itemsHeight).toBe(0);
    });
    test("should execute a scroll animation on the element", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        const itemsElement: HTMLDivElement = renderedWithImages.find(".horizontal-overflow-items-class");

        expect(
            renderedWithImages.instance()[
                "scrollLeft"
            ](
                itemsElement,
                50,
                0
            )
        ).toBe(undefined);
    });
    test("should allow clicks on previous and next buttons", () => {
        const renderedWithImagesAndNextAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">next</button>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "handleNextClick"
            ]()
        ).toBe(undefined);

        expect(
            renderedWithImagesAndNextAndPrevious.instance()[
                "handlePreviousClick"
            ]()
        ).toBe(undefined);
    });
});
/* tslint:enable:no-string-literal */
