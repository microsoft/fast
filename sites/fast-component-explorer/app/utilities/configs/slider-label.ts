import {
    SliderLabel,
    SliderLabelClassNameContract,
    sliderLabelSchema2,
} from "@microsoft/fast-components-react-msft";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import Guidance from "../../.tmp/slider-label/guidance";
import { ComponentViewConfig } from "./data.props";

const styles: ComponentStyleSheet<SliderLabelClassNameContract, DesignSystem> = {
    sliderLabel: {
        left: "20px",
    },
    sliderLabel__positionMin: {},
};

const sliderLabelConfig: ComponentViewConfig = {
    schema: sliderLabelSchema2,
    component: SliderLabel,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: sliderLabelSchema2.id,
                        data: {
                            label: "Label",
                            jssStyleSheet: styles,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default sliderLabelConfig;
