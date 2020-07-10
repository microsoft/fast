import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/carousel/gui dance";
import { ComponentViewConfig } from "./data.props";
import { fastButtonId } from "./fast-button";

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
                            style: "width: 300px;",
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "img",
                        data: {
                            src: "https://placehold.it/300x200/414141",
                        },
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "div",
                        data: {
                            style:
                                "padding: 0 10px 10px; color: var(--neutral-foreground-rest)",
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                                {
                                    id: "Slot11",
                                },
                                {
                                    id: "Slot12",
                                },
                            ],
                        },
                    },
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: "h2",
                        data: {
                            Slot: [
                                {
                                    id: "Slot100",
                                },
                            ],
                        },
                    },
                    Slot100: {
                        parent: {
                            id: "Slot10",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Heading",
                    },
                    Slot11: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: "p",
                        data: {
                            Slot: [
                                {
                                    id: "Slot110",
                                },
                            ],
                        },
                    },
                    Slot110: {
                        parent: {
                            id: "Slot11",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque varius ornare. Etiam convallis sollicitudin scelerisque. Maecenas in velit vehicula, aliquet orci et, consequat purus. Donec eget sodales lectus, vel sollicitudin ligula. Suspendisse volutpat auctor diam, vel mattis lorem venenatis in.",
                    },
                    Slot12: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: fastButtonId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot120",
                                },
                            ],
                        },
                    },
                    Slot120: {
                        parent: {
                            id: "Slot12",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Button",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastCarouselConfig;
