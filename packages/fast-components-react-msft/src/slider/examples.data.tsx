import React from "react";
import { Slider, SliderProps } from "./index";
import { SliderLabelProps } from "../slider-label";
import sliderLabelSchema from "../slider-label/slider-label.schema.json";
import schema from "./slider.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import {
    SliderMode,
    SliderOrientation,
    SliderTrackItemAnchor,
} from "@microsoft/fast-components-react-base";

function sliderLabelPropFactory(
    valuePositionBinding: SliderTrackItemAnchor | number,
    label?: string
): SliderLabelProps {
    return {
        valuePositionBinding,
        label,
    };
}

const examples: ComponentFactoryExample<SliderProps> = {
    name: "Slider",
    component: Slider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        range: {
            maxValue: 100,
            minValue: 0,
        },
        children: [
            {
                id: sliderLabelSchema.id,
                props: {
                    ...sliderLabelPropFactory(SliderTrackItemAnchor.totalRangeMin, "Low"),
                },
            },
            {
                id: sliderLabelSchema.id,
                props: {
                    ...sliderLabelPropFactory(25, "25"),
                },
            },
            {
                id: sliderLabelSchema.id,
                props: {
                    ...sliderLabelPropFactory(50, "50"),
                },
            },
            {
                id: sliderLabelSchema.id,
                props: {
                    ...sliderLabelPropFactory(75, "75"),
                },
            },
            {
                id: sliderLabelSchema.id,
                props: {
                    ...sliderLabelPropFactory(
                        SliderTrackItemAnchor.totalRangeMax,
                        "High"
                    ),
                },
            },
        ],
    },
    data: [
        {
            initialValue: 0,
        },
        {
            mode: SliderMode.adustUpperValue,
            children: [
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(
                            SliderTrackItemAnchor.totalRangeMin,
                            "min"
                        ),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(25, "25"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(50, "50"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(75, "75"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(
                            SliderTrackItemAnchor.totalRangeMax,
                            "max"
                        ),
                    },
                },
            ],
        },
        {
            step: 25,
            children: [
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(
                            SliderTrackItemAnchor.totalRangeMin,
                            "min"
                        ),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(25, "25"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(50, "50"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(75, "75"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(
                            SliderTrackItemAnchor.totalRangeMax,
                            "max"
                        ),
                    },
                },
            ],
        },
        {
            mode: SliderMode.adjustBoth,
        },
        {
            orientation: SliderOrientation.vertical,
        },
        {
            orientation: SliderOrientation.vertical,
            children: [
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(
                            SliderTrackItemAnchor.totalRangeMin,
                            "min"
                        ),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(25, "25"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(50, "50"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(75, "75"),
                    },
                },
                {
                    id: sliderLabelSchema.id,
                    props: {
                        ...sliderLabelPropFactory(
                            SliderTrackItemAnchor.totalRangeMax,
                            "max"
                        ),
                    },
                },
            ],
        },
        {
            disabled: true,
            orientation: SliderOrientation.vertical,
        },
    ],
};

export default examples;
