import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/menu/guidance";
import { placeholderIcon } from "../utilities/icons";
import { ComponentViewConfig } from "./data.props";

const startPlaceholderIcon1 = placeholderIcon("Slot0", "SlotStart");
const endPlaceholderIcon1 = placeholderIcon("Slot0", "SlotEnd");
const startPlaceholderIcon2 = placeholderIcon("Slot1", "SlotStart");
const endPlaceholderIcon2 = placeholderIcon("Slot1", "SlotEnd");
const startPlaceholderIcon3 = placeholderIcon("Slot2", "SlotStart");
const endPlaceholderIcon3 = placeholderIcon("Slot2", "SlotEnd");

export const fastMenuId = "fast-menu";
export const fastMenuItemId = "fast-menu-item";
export const fastDividerId = "fast-divider";
const fastMenuConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastMenuId],
    definition: fastComponentDefinitions[`${camelCase(fastMenuId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastMenuId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot00",
                                },
                            ],
                        },
                    },
                    Slot00: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 1",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                        },
                    },
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 2",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot20",
                                },
                            ],
                        },
                    },
                    Slot20: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 3",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With divider",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastMenuId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                                {
                                    id: "Slot3",
                                },
                                {
                                    id: "Slot4",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot00",
                                },
                            ],
                        },
                    },
                    Slot00: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 1",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                        },
                    },
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 2",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastDividerId,
                        data: {},
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot30",
                                },
                            ],
                        },
                    },
                    Slot30: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 3",
                    },
                    Slot4: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot40",
                                },
                            ],
                        },
                    },
                    Slot40: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 4",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With icons",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastMenuId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot00",
                                },
                            ],
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon1[1],
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon1[1],
                                },
                            ],
                        },
                    },
                    ...startPlaceholderIcon1[0],
                    ...endPlaceholderIcon1[0],
                    Slot00: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 1",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon2[1],
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon2[1],
                                },
                            ],
                        },
                    },
                    ...startPlaceholderIcon2[0],
                    ...endPlaceholderIcon2[0],
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 2",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastMenuItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot20",
                                },
                            ],
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon3[1],
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon3[1],
                                },
                            ],
                        },
                    },
                    ...startPlaceholderIcon3[0],
                    ...endPlaceholderIcon3[0],
                    Slot20: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Menu item 3",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastMenuConfig;
