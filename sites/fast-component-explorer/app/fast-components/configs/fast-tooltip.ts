import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/tooltip/guidance";
import { ComponentViewConfig } from "./data.props";
import { fastButtonId } from "./fast-button";

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
                        schemaId: fastButtonId,
                        data: {
                            id: "anchor",
                            style: "height: 40px; width: 100px; margin: 100px; background: green",
                            Slot: [
                                {
                                    id: "ButtonSlot",
                                }
                            ],
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
                    ButtonSlot: {
                        parent: {
                            id: "RootSlot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Hover me",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTooltipConfig;
