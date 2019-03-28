import React from "react";
import { SliderMode, SliderOrientation, SliderRange } from "./slider.props";
import { SliderThumb } from "./slider";

export interface SliderContextType {
    sliderOrientation: SliderOrientation;
    sliderConstrainedRange: SliderRange;
    sliderMode: SliderMode;
    sliderUpperValue: number;
    sliderLowerValue: number;
    sliderIsDragging: boolean;
    sliderActiveThumb: SliderThumb;
    sliderIsIncrementing: boolean;
    sliderValueAsPercent: (value: number) => number;
    sliderDirection: string;
}

export const SliderContext: React.Context<SliderContextType> = React.createContext({
    sliderOrientation: SliderOrientation.horizontal,
    sliderMode: SliderMode.adustUpperValue,
    sliderConstrainedRange: {
        minValue: 0,
        maxValue: 100,
    },
    sliderUpperValue: 0,
    sliderLowerValue: 0,
    sliderIsDragging: false,
    sliderActiveThumb: null,
    sliderIsIncrementing: false,
    sliderValueAsPercent: null,
    sliderDirection: "ltr",
});
