import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/progress/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastProgressRingId = "fast-progress-ring";
const fastProgressRingConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastProgressRingId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastProgressRingId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastProgressRingConfig;
