import Guidance from "../../.tmp/divider/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

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
