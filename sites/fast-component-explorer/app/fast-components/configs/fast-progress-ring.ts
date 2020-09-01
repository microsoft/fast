import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/progress/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastProgressRingId = "fast-progress-ring";
const fastProgressRingConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastProgressRingId],
    definition: fastComponentDefinitions[`${camelCase(fastProgressRingId)}Definition`],
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
