import { fastComponentSchemas, textSchema } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/button/guidance";
import { placeholderIcon } from "../utilities/icons";
import { ComponentViewConfig } from "./data.props";

const startPlaceholderIcon = placeholderIcon("root", "SlotStart");
const endPlaceholderIcon = placeholderIcon("root", "SlotEnd");
const defaultPlaceholderIcon = placeholderIcon("root", "Slot");

export const fastButtonId = "fast-button";
const fastButtonConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastButtonId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Disabled",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            disabled: true,
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Neutral",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            appearance: "neutral",
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Accent",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            appearance: "accent",
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Lightweight",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            appearance: "lightweight",
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Outline",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            appearance: "outline",
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Stealth",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            appearance: "stealth",
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With start",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon[1],
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
                        data: "Button",
                    },
                    ...startPlaceholderIcon[0],
                },
                "root",
            ],
        },
        {
            displayName: "With end",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon[1],
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
                        data: "Button",
                    },
                    ...endPlaceholderIcon[0],
                },
                "root",
            ],
        },
        {
            displayName: "Icon in default slot",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
                        data: {
                            Slot: [
                                {
                                    id: defaultPlaceholderIcon[1],
                                },
                            ],
                        },
                    },
                    ...defaultPlaceholderIcon[0],
                },
                "root",
            ],
        },
    ],
};

export default fastButtonConfig;
