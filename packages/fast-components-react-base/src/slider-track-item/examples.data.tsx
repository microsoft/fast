import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./slider-track-item.schema.json";
import SliderTrackItem, {
    SliderTrackItemHandledProps,
    SliderTrackItemManagedClasses,
} from "./slider-track-item";
import Documentation from "./.tmp/documentation";

const managedClasses: SliderTrackItemManagedClasses = {
    managedClasses: {
        sliderTrackItem: "sliderTrackItem",
        sliderTrackItem__orientationHorizontal: "sliderTrackItem__orientationHorizontal",
        sliderTrackItem__orientationVertical: "sliderTrackItem__orientationVertical",
    },
};

const examples: ComponentFactoryExample<SliderTrackItemHandledProps> = {
    name: "Slider track item",
    component: SliderTrackItem,
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
