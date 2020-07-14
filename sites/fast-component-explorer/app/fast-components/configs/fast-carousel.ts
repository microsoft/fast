import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/carousel/guidance";
import { ComponentViewConfig } from "./data.props";

const slottedImages: any = {
    Slot1: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: "img",
        data: {
            src: "https://placehold.it/600x300/3E3E3E/171717",
        },
    },
    Slot2: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: "img",
        data: {
            src: "https://placehold.it/600x300/",
        },
    },
    Slot3: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: "img",
        data: {
            src: "https://placehold.it/600x300/3E3E3E/171717",
        },
    },
    Slot4: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: "img",
        data: {
            src: "https://placehold.it/600x300/",
        },
    },
    Slot5: {
        parent: {
            id: "root",
            dataLocation: "Slot",
        },
        schemaId: "img",
        data: {
            src: "https://placehold.it/600x300/3E3E3E/171717",
        },
    },
    Slot6: {
        parent: {
            id: "root",
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
    {
        id: "Slot3",
    },
    {
        id: "Slot4",
    },
    {
        id: "Slot5",
    },
    {
        id: "Slot6",
    },
];

export const fastCarouselId = "fast-carousel";
const fastCarouselConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastCarouselId],
    definition: fastComponentDefinitions[`${camelCase(fastCarouselId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCarouselId,
                        data: {
                            Slot: [...slotIds],
                        },
                    },
                    ...slottedImages,
                },
                "root",
            ],
        },
        {
            displayName: "Paused and Active ID",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCarouselId,
                        data: {
                            paused: "true",
                            activeid: "tab-2",
                            Slot: [...slotIds],
                        },
                    },
                    ...slottedImages,
                },
                "root",
            ],
        },
        {
            displayName: "No Autoplay",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCarouselId,
                        data: {
                            autoplay: false,
                            Slot: [...slotIds],
                        },
                    },
                    ...slottedImages,
                },
                "root",
            ],
        },
        {
            displayName: "Not Tabbed Pattern (Basic)",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCarouselId,
                        data: {
                            autoplay: false,
                            notTabbedPattern: true,
                            Slot: [...slotIds],
                        },
                    },
                    ...slottedImages,
                },
                "root",
            ],
        },
    ],
};

export default fastCarouselConfig;
