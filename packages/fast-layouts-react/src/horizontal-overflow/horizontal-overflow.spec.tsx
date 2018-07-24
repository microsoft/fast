import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import HorizontalOverflow, {
    ButtonDirection,
    IHorizontalOverflowHandledProps,
    IHorizontalOverflowClassNameContract
} from "./";

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

describe("horizontal overflow", (): void => {
    const Component: React.ComponentClass<IHorizontalOverflowHandledProps> = HorizontalOverflow;

    test("should render a previous button if one is passed as a child with the appropriate slot prop", () => {
        const renderedWithImagesAndPrevious: any = shallow(
            <HorizontalOverflow>
                <button id="testButtonPrevious" slot="previous">previous</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndPrevious.find("#testButtonPrevious")).not.toBe(undefined);
    });
    test("should render a next button if one is passed as a child with the appropriate slot prop", () => {
        const renderedWithImagesAndNext: any = shallow(
            <HorizontalOverflow>
                <button id="testButtonNext" slot="next">next</button>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImagesAndNext.find("#testButtonNext")).not.toBe(undefined);
    });
    test("should render a series of items if they are passed as children", () => {
        const renderedWithImages: any = shallow(
            <HorizontalOverflow>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.find("img").length).toBe(6);
    });
    test("should update the rendering of a series of items if they are modified", () => {
        const renderedWithImages: any = shallow(
            <HorizontalOverflow>
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
        const renderedWithImages: any = shallow(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages.first().shallow().instance()[
                "getMoveDistanceFromDirection"
            ](
                ButtonDirection.next,
                50,
                [10, 20, 20, 50, 20],
                0
            )
        ).toBe(50);

        // reaches the max distance and uses that instead
        expect(
            renderedWithImages.first().shallow().instance()[
                "getMoveDistanceFromDirection"
            ](
                ButtonDirection.next,
                40,
                [10, 20, 10, 30, 20, 10],
                30
            )
        ).toBe(60);

        expect(
            renderedWithImages.first().shallow().instance()[
                "getMoveDistanceFromDirection"
            ](
                ButtonDirection.next,
                40,
                [10, 20, 10, 30, 20, 10, 20, 10],
                30
            )
        ).toBe(70);

        expect(
            renderedWithImages.first().shallow().instance()[
                "getMoveDistanceFromDirection"
            ](
                ButtonDirection.next,
                40,
                [10, 20, 10, 30, 20, 10, 20, 10],
                40
            )
        ).toBe(70);
    });
    test("should update the scrolled distance when moving previous to include the previous number of items that can be in view", () => {
        const renderedWithImages: any = shallow(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(
            renderedWithImages.first().shallow().instance()[
                "getMoveDistanceFromDirection"
            ](
                ButtonDirection.previous,
                50,
                [10, 20, 20, 50, 20],
                10
            )
        ).toBe(0);

        expect(
            renderedWithImages.first().shallow().instance()[
                "getMoveDistanceFromDirection"
            ](
                ButtonDirection.previous,
                50,
                [50, 50, 50, 50],
                100
            )
        ).toBe(50);
    });
    test("should an state property `itemsHeight`", () => {
        const renderedWithImages: any = shallow(
            <HorizontalOverflow managedClasses={managedClasses}>
                {imageSet1}
            </HorizontalOverflow>
        );

        expect(renderedWithImages.first().shallow().state("itemsHeight")).toBe("0");
    });
});