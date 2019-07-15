import { ComponentViewConfig } from "./data.props";
import {
    SliderLabel,
    SliderLabelClassNameContract,
    SliderLabelProps,
    sliderLabelSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/slider-label/guidance";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";

const styles: ComponentStyleSheet<SliderLabelClassNameContract, DesignSystem> = {
    sliderLabel: {
        left: "20px",
    },
    sliderLabel__positionMin: {},
};

const sliderLabelConfig: ComponentViewConfig<SliderLabelProps> = {
    schema: sliderLabelSchema,
    component: SliderLabel,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                label: "Label",
                jssStyleSheet: styles,
            },
        },
    ],
};

export default sliderLabelConfig;
