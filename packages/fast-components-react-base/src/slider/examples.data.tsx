import React from "react";
import Slider, {
    SliderHandledProps,
    SliderManagedClasses,
    SliderUnhandledProps,
} from "./slider";
import schema from "./slider.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const managedClasses: SliderManagedClasses = {
    managedClasses: {
        slider: "slider",
        slider__horizontal: "slider__horizontal",
        slider__vertical: "slider__vertical",
        slider_layoutRegion: "slider_layoutRegion",
        slider_thumb: "slider__thumb",
        slider_thumb__upperValue: "slider_thumb__upperValue",
        slider_thumb__lowerValue: "slider_thumb__lowerValue",
        slider_backgroundTrack: "slider_backgroundTrack",
        slider_foregroundTrack: "slider_foregroundTrack",
        slider__disabled: "slider__disabled",
        slider__modeSingle: "slider__modeSingle",
        slider__modeAdjustLower: "slider__modeAdjustLower",
        slider__modeAdjustUpper: "slider__modeAdjustUpper",
        slider__modeAdjustBoth: "slider__modeAdjustBoth",
        slider__rtl: "slider__rtl",
    },
};

const examples: ComponentFactoryExample<SliderHandledProps> = {
    name: "Slider",
    component: Slider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
    },
    data: [
        {
            ...managedClasses,
        },
    ],
};

export default examples;
