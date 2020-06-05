import Guidance from "../../.tmp/slider/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

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
