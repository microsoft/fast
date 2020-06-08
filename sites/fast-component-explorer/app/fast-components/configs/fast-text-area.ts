import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/text-area/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTextAreaId = "fast-text-area";
const fastTextAreaConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTextAreaId],
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
