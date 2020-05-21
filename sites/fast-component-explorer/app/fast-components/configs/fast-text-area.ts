import Guidance from "../../.tmp/text-area/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastTextAreaId = "fast-text-area";
const fastTextAreaConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastTextAreaId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastTextAreaId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTextAreaConfig;
