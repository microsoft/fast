import { fastComponentSchemas } from "@microsoft/site-utilities";
import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/menu/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastMenuId = "fast-menu";
export const fastMenuItemId = "fast-menu-item";
const fastMenuConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastMenuId],
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
    ],
};

export default fastMenuConfig;
