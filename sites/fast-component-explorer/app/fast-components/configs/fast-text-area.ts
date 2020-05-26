import Guidance from "../../.tmp/text-area/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

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
