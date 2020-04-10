import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { Direction } from "@microsoft/fast-web-utilities";
import { SliderContext, SliderMode, SliderOrientation } from "../slider";
import { DisplayNamePrefix } from "../utilities";
import { SliderState } from "../slider/slider";
import SliderTrackItem, {
    SliderTrackItemAnchor,
    SliderTrackItemUnhandledProps,
} from "./slider-track-item";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("slider track item", (): void => {
    const defaultSliderState: SliderState = {
        dragValue: -1,
        upperValue: 100,
        lowerValue: 0,
        activeThumb: null,
        isMouseDragging: false,
        isTouchDragging: false,
        isIncrementing: false,
        incrementDirection: 1,
        usePageStep: false,
        direction: Direction.ltr,
    };

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(SliderTrackItem as any).name}`).toBe(
            SliderTrackItem.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<SliderTrackItem />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: SliderTrackItemUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<SliderTrackItem {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("totalRangeMax and totalRangeMin bindings don't call getValueAsPercent", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);
        const getValueAsPercent: any = jest.fn();

        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
        const rendered: any = mount(
            <SliderContext.Provider
                value={{
                    sliderOrientation: SliderOrientation.horizontal,
                    sliderMode: SliderMode.singleValue,
                    sliderState: defaultSliderState,
                    sliderConstrainedRange: undefined,
                    sliderValueAsPercent: getValueAsPercent,
                    sliderDirection: Direction.ltr,
                }}
            >
                <SliderTrackItem
                    maxValuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                    minValuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                />
            </SliderContext.Provider>,
            { attachTo: container }
        );

        expect(getValueAsPercent).toHaveBeenCalledTimes(0);
        document.body.removeChild(container);
    });

    test("numeric bindings call getValueAsPercent", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);
        const getValueAsPercent: any = jest.fn();
        getValueAsPercent.mockReturnValueOnce(90);
        getValueAsPercent.mockReturnValueOnce(10);

        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
        const rendered: any = mount(
            <SliderContext.Provider
                value={{
                    sliderOrientation: SliderOrientation.horizontal,
                    sliderMode: SliderMode.singleValue,
                    sliderState: defaultSliderState,
                    sliderConstrainedRange: undefined,
                    sliderValueAsPercent: getValueAsPercent,
                    sliderDirection: Direction.ltr,
                }}
            >
                <SliderTrackItem
                    id="trackItem"
                    maxValuePositionBinding={90}
                    minValuePositionBinding={10}
                />
            </SliderContext.Provider>,
            { attachTo: container }
        );

        expect(getValueAsPercent).toHaveBeenCalledTimes(2);
        document.body.removeChild(container);
    });

    test("selectedRangeMax and selectedRangeMin bindings don't call getValueAsPercent", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);
        const getValueAsPercent: any = jest.fn();

        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
        const rendered: any = mount(
            <SliderContext.Provider
                value={{
                    sliderOrientation: SliderOrientation.horizontal,
                    sliderMode: SliderMode.singleValue,
                    sliderState: defaultSliderState,
                    sliderConstrainedRange: undefined,
                    sliderValueAsPercent: getValueAsPercent,
                    sliderDirection: Direction.ltr,
                }}
            >
                <SliderTrackItem
                    maxValuePositionBinding={SliderTrackItemAnchor.selectedRangeMax}
                    minValuePositionBinding={SliderTrackItemAnchor.selectedRangeMin}
                />
            </SliderContext.Provider>,
            { attachTo: container }
        );

        expect(getValueAsPercent).toHaveBeenCalledTimes(2);
        document.body.removeChild(container);
    });

    test("getPositonAsPercent() returns correct values for anchors", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);
        const getValueAsPercent: any = jest.fn();
        getValueAsPercent.mockReturnValueOnce(20);
        getValueAsPercent.mockReturnValueOnce(80);
        getValueAsPercent.mockReturnValueOnce(20);
        getValueAsPercent.mockReturnValueOnce(80);
        getValueAsPercent.mockReturnValueOnce(10);
        getValueAsPercent.mockReturnValueOnce(90);

        const rendered: any = mount(
            <SliderContext.Provider
                value={{
                    sliderOrientation: SliderOrientation.horizontal,
                    sliderMode: SliderMode.singleValue,
                    sliderState: defaultSliderState,
                    sliderConstrainedRange: { minValue: 20, maxValue: 80 },
                    sliderValueAsPercent: getValueAsPercent,
                    sliderDirection: Direction.ltr,
                }}
            >
                <SliderTrackItem
                    maxValuePositionBinding={SliderTrackItemAnchor.selectedRangeMax}
                    minValuePositionBinding={SliderTrackItemAnchor.selectedRangeMin}
                />
            </SliderContext.Provider>,
            { attachTo: container }
        );

        const trackItem: any = rendered.find("BaseSliderTrackItem");

        expect(
            trackItem
                .instance()
                ["getPositionAsPercent"](SliderTrackItemAnchor.totalRangeMin)
        ).toBe(0);
        expect(
            trackItem
                .instance()
                ["getPositionAsPercent"](SliderTrackItemAnchor.totalRangeMax)
        ).toBe(100);

        expect(
            trackItem
                .instance()
                ["getPositionAsPercent"](SliderTrackItemAnchor.constrainedRangeMin)
        ).toBe(20);
        expect(
            trackItem
                .instance()
                ["getPositionAsPercent"](SliderTrackItemAnchor.constrainedRangeMax)
        ).toBe(80);

        expect(
            trackItem
                .instance()
                ["getPositionAsPercent"](SliderTrackItemAnchor.selectedRangeMin)
        ).toBe(10);
        expect(
            trackItem
                .instance()
                ["getPositionAsPercent"](SliderTrackItemAnchor.selectedRangeMax)
        ).toBe(90);

        document.body.removeChild(container);
    });
});
