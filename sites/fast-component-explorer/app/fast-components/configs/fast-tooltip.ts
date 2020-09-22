import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/tooltip/guidance";
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
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "RootSlot1",
                                },
                                {
                                    id: "RootSlot2",
                                }
                            ],
                        },
                    },
                    RootSlot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "div",
                        data: {
                            id: "anchor",
                            style: "height: 40px; width: 40px; background: green",
                        }
                    },
                    RootSlot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastTooltipId,
                        data: {
                            anchor: "anchor",
                            visible: true,
                            Slot: [
                                {
                                    id: "TooltipSlot",
                                },
                            ],
                        },
                    },
                    TooltipSlot: {
                        parent: {
                            id: "RootSlot2",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Tooltip text",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTooltipConfig;
