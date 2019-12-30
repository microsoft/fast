import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Slider,
    sliderLabelSchema,
    SliderProps,
    sliderSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/slider/guidance";
import API from "../api";

const sliderConfig: ComponentViewConfig<SliderProps> = {
    api: API(React.lazy(() => import("../../.tmp/slider/api"))),
    schema: sliderSchema,
    component: Slider,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {},
        },
        {
            displayName: "Min and max",
            data: {
                range: {
                    minValue: 0,
                    maxValue: 100,
                },
            },
        },
        {
            displayName: "With indicators",
            data: {
                range: {
                    minValue: 0,
                    maxValue: 100,
                },
                children: [
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 0,
                            label: "low",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 25,
                            label: "25",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 50,
                            label: "low",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 75,
                            label: "low",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 100,
                            label: "high",
                        },
                    },
                ],
            },
        },
    ],
};

export default sliderConfig;
