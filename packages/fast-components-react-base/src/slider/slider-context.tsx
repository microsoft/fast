import React from "react";
import { SliderMode, SliderOrientation, SliderRange } from "./slider.props";
import { SliderState, SliderThumb } from "./slider";

export interface SliderContextType {
    sliderOrientation: SliderOrientation;
    sliderConstrainedRange: SliderRange;
    sliderMode: SliderMode;
    sliderState: SliderState;
    sliderValueAsPercent: (value: number) => number;
    sliderDirection: string;
}

export const SliderContext: React.Context<SliderContextType> = React.createContext({
    sliderOrientation: SliderOrientation.horizontal,
    sliderMode: SliderMode.adustUpperValue,
    sliderConstrainedRange: null,
    sliderState: null,
    sliderValueAsPercent: null,
    sliderDirection: "ltr",
});
