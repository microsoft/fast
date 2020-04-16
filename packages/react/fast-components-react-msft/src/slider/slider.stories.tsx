import { storiesOf } from "@storybook/react";
import React from "react";
import {
    SliderHandledProps,
    SliderMode,
    SliderOrientation,
    SliderState,
    SliderTrackItemAnchor,
} from "@microsoft/fast-components-react-base";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, designUnit } from "@microsoft/fast-components-styles-msft";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";
import { action } from "@storybook/addon-actions";
import { SliderLabel } from "../slider-label";
import { Heading, HeadingSize } from "../heading";
import { Slider, SliderClassNameContract } from "./";

const vertcialSliderStyles: ComponentStyleSheet<SliderClassNameContract, DesignSystem> = {
    slider: {
        "&$slider__vertical": {
            height: toPx(multiply(designUnit, 40)),
        },
    },
    slider__vertical: {},
};

storiesOf("Slider", module)
    .add("Default", () => <Slider onValueChange={action("onValueChange")} />)
    .add("Min and max", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            onValueChange={action("onValueChange")}
        />
    ))
    .add("With indicators", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Range", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            mode={SliderMode.adjustBoth}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Range - lower adjustment", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            mode={SliderMode.adustLowerValue}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Range - higher adjustment", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            mode={SliderMode.adustUpperValue}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Stepped", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            step={25}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Vertical", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            orientation={SliderOrientation.vertical}
            jssStyleSheet={vertcialSliderStyles}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Multiple", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            mode={SliderMode.adjustBoth}
            jssStyleSheet={vertcialSliderStyles}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Disabled", () => (
        <Slider
            range={{ minValue: 0, maxValue: 100 }}
            disabled={true}
            onValueChange={action("onValueChange")}
        >
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                label="Low"
            />
            <SliderLabel valuePositionBinding={25} label="25" />
            <SliderLabel valuePositionBinding={50} label="50" />
            <SliderLabel valuePositionBinding={75} label="75" />
            <SliderLabel
                valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                label="High"
            />
        </Slider>
    ))
    .add("Narrate labels", () => (
        <div>
            <Heading
                size={HeadingSize._4}
                id="sliderHeading"
                style={{
                    margin: "0 0 20px 0",
                }}
            >
                Select speed
            </Heading>
            <Slider
                range={{ minValue: 1, maxValue: 3 }}
                onValueChange={action("onValueChange")}
                maxThumbLabelledBy="sliderHeading sliderLabelLow sliderLabelMedium sliderLabelHigh"
                valuetextStringFormatter={(
                    sliderProps: SliderHandledProps,
                    sliderState: SliderState
                ): string => {
                    switch (sliderState.upperValue) {
                        case 1:
                            return "low";

                        case 2:
                            return "medium";

                        case 3:
                            return "high";
                    }
                }}
            >
                <SliderLabel
                    id="sliderLabelLow"
                    valuePositionBinding={SliderTrackItemAnchor.totalRangeMin}
                    label="Low"
                />
                <SliderLabel
                    id="sliderLabelMedium"
                    valuePositionBinding={2}
                    label="medium"
                />
                <SliderLabel
                    id="sliderLabelHigh"
                    valuePositionBinding={SliderTrackItemAnchor.totalRangeMax}
                    label="High"
                />
            </Slider>
        </div>
    ));
