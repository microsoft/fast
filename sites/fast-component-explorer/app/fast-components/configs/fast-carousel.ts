import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/carousel/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTabId = "fast-tab";
export const fastTabPanelId = "fast-tab-panel";

const slottedImages: any = {
    Slot1: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: fastTabId,
        data: {},
    },
    Slot2: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: fastTabPanelId,
        data: {},
    },
    Slot21: {
        parent: {
            id: "Slot2",
            dataLocation: "Slot",
        },
        schemaId: "img",
        data: {
            src: "https://placehold.it/600x300/",
        },
    },
};

const slotIds: any[] = [
    {
        id: "Slot1",
    },
    {
        id: "Slot2",
    },
];

export const fastCarouselId = "fast-carousel";

const fastCarouselConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastCarouselId],
    definition: fastComponentDefinitions[`${camelCase(fastCarouselId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default Tabbed",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCarouselId,
                        data: {
                            style: "width: 600px; height: 200px",
                            SlotTab: [
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
                            SlotTabpanel: [
                                {
                                    id: "Slot3",
                                },
                                {
                                    id: "Slot4",
                                },
                                {
                                    id: "Slot5",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotTab",
                        },
                        schemaId: fastTabId,
                        data: {},
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotTab",
                        },
                        schemaId: fastTabId,
                        data: {},
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotTab",
                        },
                        schemaId: fastTabId,
                        data: {},
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotTabpanel",
                        },
                        schemaId: fastTabPanelId,
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
                        schemaId: "img",
                        data: {
                            src: "https://placehold.it/500x250?text=TabPanel1",
                        },
                    },
                    Slot4: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotTabpanel",
                        },
                        schemaId: fastTabPanelId,
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
                        schemaId: "img",
                        data: {
                            src: "https://placehold.it/500x250?text=TabPanel2",
                        },
                    },
                    Slot5: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotTabpanel",
                        },
                        schemaId: fastTabPanelId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot50",
                                },
                            ],
                        },
                    },
                    Slot50: {
                        parent: {
                            id: "Slot5",
                            dataLocation: "Slot",
                        },
                        schemaId: "img",
                        data: {
                            src: "https://placehold.it/500x250?text=TabPanel3",
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Default Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCarouselId,
                        data: {
                            style: "width: 600px; height: 200px",
                            pattern: "basic",
                            Slot: [
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                                {
                                    id: "Slot3",
                                },
                            ],
                        },
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "img",
                        data: {
                            src:
                                "https://placehold.it/500x250/3E3E3E/171717?text=TabPanel1",
                        },
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "img",
                        data: {
                            src: "https://placehold.it/500x250?text=TabPanel2",
                        },
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "img",
                        data: {
                            src:
                                "https://placehold.it/500x250/3E3E3E/171717?text=TabPanel3",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastCarouselConfig;
