import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { sliderTrackItemSchema } from "../index";
import SliderTrackItem, {
    SliderTrackItemHandledProps,
    SliderTrackItemManagedClasses,
} from "./slider-track-item";
import Documentation from "./.tmp/documentation";

const managedClasses: SliderTrackItemManagedClasses = {
    managedClasses: {
        sliderTrackItem: "sliderTrackItem",
        sliderTrackItem_horizontal: "sliderTrackItem_horizontal",
        sliderTrackItem_vertical: "sliderTrackItem_vertical",
    },
};

const examples: ComponentFactoryExample<SliderTrackItemHandledProps> = {
    name: "Slider track item",
    component: SliderTrackItem,
    schema: sliderTrackItemSchema as any,
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
