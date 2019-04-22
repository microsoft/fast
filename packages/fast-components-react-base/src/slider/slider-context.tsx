import React from "react";
import { SliderMode, SliderOrientation, SliderRange } from "./slider.props";
import { SliderState } from "./slider";
import { Direction } from "@microsoft/fast-web-utilities";

export interface SliderContextType {
    sliderOrientation: SliderOrientation;
    sliderConstrainedRange: SliderRange;
    sliderMode: SliderMode;
    sliderState: SliderState;
    sliderValueAsPercent: (value: number) => number;
    sliderDirection: Direction;
}

export const SliderContext: React.Context<SliderContextType> = React.createContext({
    sliderOrientation: SliderOrientation.horizontal,
    sliderMode: SliderMode.adustUpperValue,
    sliderConstrainedRange: null,
    sliderState: null,
    sliderValueAsPercent: null,
    sliderDirection: Direction.ltr,
});
