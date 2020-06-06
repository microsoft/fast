import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/slider/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastSliderId = "fast-slider";
export const fastSliderLabelId = "fast-slider-label";
const fastSliderConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSliderId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSliderId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastSliderConfig;
