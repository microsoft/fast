import * as React from "react";
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
        slider__orientationHorizontal: "slider__orientationHorizontal",
        slider__orientationVertical: "slider__orientationVertical",
        slider_layoutPanel: "slider_layoutPanel",
        slider_thumb_upper: "slider__thumb_upper",
        slider_thumb_lower: "slider__thumb_lower",
        slider_barBack: "slider_barBack",
        slider_barFront: "slider_barFront",
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
