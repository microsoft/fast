import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    SliderLabel,
    SliderLabelClassNameContract,
    SliderLabelProps,
    sliderLabelSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/slider-label/guidance";
import API from "../api";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";

const styles: ComponentStyleSheet<SliderLabelClassNameContract, DesignSystem> = {
    sliderLabel: {
        left: "20px",
    },
    sliderLabel__positionMin: {},
};

const sliderLabelConfig: ComponentViewConfig<SliderLabelProps> = {
    api: API(React.lazy(() => import("../../.tmp/slider-label/api"))),
    schema: sliderLabelSchema,
    component: SliderLabel,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                label: "Label",
                jssStyleSheet: styles,
            },
        },
    ],
};

export default sliderLabelConfig;
