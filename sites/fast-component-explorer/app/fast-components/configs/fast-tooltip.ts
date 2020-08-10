import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/badge/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTooltipId = "fast-tooltip";
const fastTooltipConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTooltipId],
    definition: fastComponentDefinitions[`${camelCase(fastTooltipId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastTooltipId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                        },
                    },
                    Slot: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Tooltip",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTooltipConfig;
