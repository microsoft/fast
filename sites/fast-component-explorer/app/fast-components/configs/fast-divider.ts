import Guidance from "../../.tmp/divider/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastDividerId = "fast-divider";
const fastDividerConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastDividerId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastDividerId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastDividerConfig;
