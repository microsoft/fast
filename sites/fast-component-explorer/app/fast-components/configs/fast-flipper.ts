import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/flipper/guidance";
import { placeholderIcon } from "../utilities/icons";
import { ComponentViewConfig } from "./data.props";

const previousPlaceholderIcon = placeholderIcon("root", "SlotPrevious");
const nextPlaceholderIcon = placeholderIcon("root", "SlotNext");

export const fastFlipperId = "fast-flipper";
const fastFlipperConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastFlipperId],
    definition: fastComponentDefinitions[`${camelCase(fastFlipperId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastFlipperId,
                        data: {
                            hiddenFromAT: true,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Previous",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastFlipperId,
                        data: {
                            direction: "previous",
                            hiddenFromAT: true,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Next with slotted content",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastFlipperId,
                        data: {
                            hiddenFromAT: true,
                            SlotNext: [
                                {
                                    id: nextPlaceholderIcon[1],
                                },
                            ],
                        },
                    },
                    ...nextPlaceholderIcon[0],
                },
                "root",
            ],
        },
        {
            displayName: "Previous with slotted content",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastFlipperId,
                        data: {
                            direction: "previous",
                            hiddenFromAT: true,
                            SlotPrevious: [
                                {
                                    id: previousPlaceholderIcon[1],
                                },
                            ],
                        },
                    },
                    ...previousPlaceholderIcon[0],
                },
                "root",
            ],
        },
    ],
};

export default fastFlipperConfig;
