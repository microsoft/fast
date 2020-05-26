import Guidance from "../../.tmp/progress/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

export const fastProgressRingId = "fast-progress-ring";
const fastProgressRingConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastProgressRingId],
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
