import { SliderTrackItemAnchor } from "@microsoft/fast-components-react-base";
import {
    Slider,
    sliderLabelSchema,
    SliderProps,
    sliderSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/slider/guidance";
import { ComponentViewConfig } from "./data.props";

const sliderConfig: ComponentViewConfig<SliderProps> = {
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
                            valuePositionBinding: SliderTrackItemAnchor.totalRangeMin,
                            label: "Lowest",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 25,
                            label: "1/4",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 50,
                            label: "Middle",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: 75,
                            label: "3/4",
                        },
                    },
                    {
                        id: sliderLabelSchema.id,
                        props: {
                            valuePositionBinding: SliderTrackItemAnchor.totalRangeMax,
                            label: "Highest",
                        },
                    },
                ],
            },
        },
    ],
};

export default sliderConfig;
