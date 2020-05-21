import Guidance from "../../.tmp/slider/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastSliderId = "fast-slider";
export const fastSliderLabelId = "fast-slider-label";
const fastSliderConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastSliderId],
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
