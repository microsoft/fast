import Guidance from "../../.tmp/progress/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

export const fastProgressId = "fast-progress";
const fastProgressConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastProgressId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastProgressId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastProgressConfig;
