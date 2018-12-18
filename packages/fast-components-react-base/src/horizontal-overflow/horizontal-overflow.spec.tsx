import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import HorizontalOverflow, {
    ButtonDirection,
    HorizontalOverflowClassNameContract,
} from "./";
import "raf/polyfill";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const id1: string = "image1";
const id2: string = "image2";
const id3: string = "image3";
const id4: string = "image4";
const id5: string = "image5";
const id6: string = "image6";
const id7: string = "image7";
const id8: string = "image8";
const id9: string = "image9";
const id10: string = "image10";
const id11: string = "image11";
const id12: string = "image12";

const imageSet1: JSX.Element[] = [
    <img id={id1} key={id1} src="https://placehold.it/200x200?text=1" />,
    <img id={id2} key={id2} src="https://placehold.it/200x200?text=2" />,
    <img id={id3} key={id3} src="https://placehold.it/200x200?text=3" />,
    <img id={id4} key={id4} src="https://placehold.it/200x200?text=4" />,
    <img id={id5} key={id5} src="https://placehold.it/200x200?text=5" />,
    <img id={id6} key={id6} src="https://placehold.it/200x200?text=6" />,
];

const imageSet2: JSX.Element[] = [
    <img id={id7} key={id7} src="https://placehold.it/200x200?text=7" />,
    <img id={id8} key={id8} src="https://placehold.it/200x200?text=8" />,
    <img id={id9} key={id9} src="https://placehold.it/200x200?text=9" />,
    <img id={id10} key={id10} src="https://placehold.it/200x200?text=10" />,
    <img id={id11} key={id11} src="https://placehold.it/200x200?text=11" />,
    <img id={id12} key={id12} src="https://placehold.it/200x200?text=12" />,
];

const managedClasses: HorizontalOverflowClassNameContract = {
    horizontalOverflow: "horizontal-overflow-class",
    horizontalOverflow_contentRegion: "horizontal-overflow-items-class",
    horizontalOverflow_item: "horizontal-overflow-item",
    horizontalOverflow_next: "horizontal-overflow-next-class",
    horizontalOverflow_previous: "horizontal-overflow-previous-class",
};

// TODO #746: https://github.com/Microsoft/fast-dna/issues/746

/* tslint:disable:no-string-literal */
describe("horizontal overflow", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((HorizontalOverflow as any).name).toBe(HorizontalOverflow.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<HorizontalOverflow />);
        }).not.toThrow();
    });

    test("should trigger a snapshot when children have been added", () => {
        const callback: any = jest.fn();
        const renderedWithImages: any = mount(
            <HorizontalOverflow
                managedClasses={managedClasses}
                onOverflowChange={callback}
            >
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.find("li")).toHaveLength(6);
        expect(callback).toHaveBeenCalledTimes(0);

        renderedWithImages.setProps({ children: imageSet1.concat(imageSet2) });

        expect(renderedWithImages.find("li")).toHaveLength(12);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should be a list of items which contain each item", () => {
        const renderedWithImagesAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndPrevious.find("ul").length).toBe(1);
        expect(renderedWithImagesAndPrevious.find("li").length).toBe(6);
        expect(
            renderedWithImagesAndPrevious
                .find("li")
                .at(0)
                .find("img")
                .prop("id")
        ).toBe(id1);
        expect(
            renderedWithImagesAndPrevious
                .find("li")
                .at(1)
                .find("img")
                .prop("id")
        ).toBe(id2);
        expect(
            renderedWithImagesAndPrevious
                .find("li")
                .at(2)
                .find("img")
                .prop("id")
        ).toBe(id3);
        expect(
            renderedWithImagesAndPrevious
                .find("li")
                .at(3)
                .find("img")
                .prop("id")
        ).toBe(id4);
        expect(
            renderedWithImagesAndPrevious
                .find("li")
                .at(4)
                .find("img")
                .prop("id")
        ).toBe(id5);
        expect(
            renderedWithImagesAndPrevious
                .find("li")
                .at(5)
                .find("img")
                .prop("id")
        ).toBe(id6);
    });

    test("should add a style of `display: inline-block` to the list item containing each item", () => {
        const rendered: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            rendered
                .find("li")
                .at(0)
                .props().style
        ).toEqual({ display: "inline-block" });
    });

    test("should render a previous button if one is passed as a child with the appropriate slot prop", () => {
        const renderedWithImagesAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonPrevious" slot="previous">
                    previous
                </button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndPrevious.find("#testButtonPrevious")).not.toBe(
            undefined
        );
    });
    test("should render a next button if one is passed as a child with the appropriate slot prop", () => {
        const renderedWithImagesAndNext: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">
                    next
                </button>
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

        renderedWithImages.setProps({
            children: [
                <img key="image1" src="https://placehold.it/200x200?text=1" />,
                <img key="image2" src="https://placehold.it/200x200?text=2" />,
            ],
        });

        expect(renderedWithImages.find("img").length).toBe(2);
    });
    test("should update the scrolled distance when moving next to include the next number of items that can be in view", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
                    ButtonDirection.next,
                    50,
                    [10, 20, 20, 50, 20],
                    0
                )
        ).toBe(50);

        // reaches the max distance and uses that instead
        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
                    ButtonDirection.next,
                    40,
                    [10, 20, 10, 30, 20, 10],
                    30
                )
        ).toBe(60);

        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
                    ButtonDirection.next,
                    40,
                    [10, 20, 10, 30, 20, 10, 20, 10],
                    30
                )
        ).toBe(70);

        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
                    ButtonDirection.next,
                    40,
                    [10, 20, 10, 30, 20, 10, 20, 10],
                    40
                )
        ).toBe(70);
    });

    test("should update the scrolled distance when moving next in round numbers", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
                    ButtonDirection.next,
                    50,
                    [10.01, 20.3, 20.5, 50.2, 20.9],
                    0
                )
        ).toBe(31);
    });

    test("should update the scrolled distance when moving previous to include the previous number of items that can be in view", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
                    ButtonDirection.previous,
                    50,
                    [10, 20, 20, 50, 20],
                    10
                )
        ).toBe(0);

        expect(
            renderedWithImages
                .instance()
                ["getScrollDistanceFromDirection"](
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
        expect(renderedWithImages.instance()["getItemMaxHeight"]()).toBe(0);
    });
    test("should ease the animation correctly when moving the scroll position", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.instance()["easeInOutQuad"](1, 0, 0.5, 50)).toBe(
            0.0004
        );
    });
    test("should get the distance when moving next/previous", () => {
        const renderedWithImagesAndNextAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">
                    next
                </button>
                <button id="testButtonPrevious" slot="previous">
                    previous
                </button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getNextDistance"](
                    500,
                    [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190],
                    0
                )
        ).toBe(340);

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getNextDistance"](
                    500,
                    [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190],
                    2100
                )
        ).toBe(2100);

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getPreviousDistance"](
                    500,
                    [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190],
                    560
                )
        ).toBe(120);

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getPreviousDistance"](
                    500,
                    [120, 140, 80, 220, 210, 100, 90, 200, 190, 170, 180, 210, 190],
                    0
                )
        ).toBe(0);

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getScrollDistanceFromDirection"]("next", 500, [], 0)
        ).toBe(0);
    });
    test("should set a max/min distance without additional calculations", () => {
        const renderedWithImagesAndNextAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">
                    next
                </button>
                <button id="testButtonPrevious" slot="previous">
                    previous
                </button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getWithinMaxDistance"](400, 500, [], 400)
        ).toBe(400);

        expect(
            renderedWithImagesAndNextAndPrevious
                .instance()
                ["getWithinMinDistance"](0, 500, [])
        ).toBe(0);
    });
    test("should have an `onLoad` method", () => {
        const renderedWithImages: any = mount(
            <HorizontalOverflow className="foo" managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.instance()["itemsOnLoad"]()).toBe(undefined);

        expect(renderedWithImages.instance().state.itemsHeight).toBe(0);

        renderedWithImages.setState({ itemsHeight: 50 });

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

        const itemsElement: HTMLDivElement = renderedWithImages.find(
            ".horizontal-overflow-items-class"
        );

        expect(renderedWithImages.instance()["scrollLeft"](itemsElement, 50, 0)).toBe(
            undefined
        );
    });
    test("should allow clicks on previous and next buttons", () => {
        const renderedWithImagesAndNextAndPrevious: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                <button id="testButtonNext" slot="next">
                    next
                </button>
                <button id="testButtonPrevious" slot="previous">
                    previous
                </button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndNextAndPrevious.instance()["handleNextClick"]()).toBe(
            undefined
        );

        expect(
            renderedWithImagesAndNextAndPrevious.instance()["handlePreviousClick"]()
        ).toBe(undefined);
    });
    test("should add resize event listener to the window", (): void => {
        const map: any = {};
        const resizeCallback: any = jest.fn();

        // Mock window.removeEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            // if an event is added for resize, add a callback to mock
            if (event === "resize") {
                callback = resizeCallback;
            }

            map[event] = callback;
        });

        const rendered: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        map.resize();

        expect(resizeCallback).toHaveBeenCalledTimes(1);
        expect(window.addEventListener).toHaveBeenCalled();
    });
    test("should remove a resize event listener from the window when component unmounts", (): void => {
        const map: any = {};
        const resizeCallback: any = jest.fn();

        // Mock window.removeEventListener
        window.removeEventListener = jest.fn((event: string, callback: any) => {
            // if an event is added for resize, add a callback to mock
            if (event === "resize") {
                callback = resizeCallback;
            }

            map[event] = callback;
        });

        const rendered: any = mount(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        rendered.unmount();

        map.resize();

        expect(resizeCallback).toHaveBeenCalledTimes(1);
        expect(window.removeEventListener).toHaveBeenCalled();
        expect(resizeCallback.mock.calls[0][0]).not.toBe("resize");
    });
});
/* tslint:enable:no-string-literal */
