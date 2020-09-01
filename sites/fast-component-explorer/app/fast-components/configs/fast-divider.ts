import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/divider/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastDividerId = "fast-divider";
const fastDividerConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastDividerId],
    definition: fastComponentDefinitions[`${camelCase(fastDividerId)}Definition`],
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
