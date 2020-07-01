import React from "react";
import { Direction } from "@microsoft/fast-web-utilities";
import { SliderMode, SliderOrientation, SliderRange } from "./slider.props";
import { SliderState } from "./slider";

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
} as SliderContextType);
