import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/progress/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastProgressId = "fast-progress";
const fastProgressConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastProgressId],
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
