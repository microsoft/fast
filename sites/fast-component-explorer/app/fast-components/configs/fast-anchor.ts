import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/anchor/guidance";
import { placeholderIcon } from "../utilities/icons";
import { ComponentViewConfig } from "./data.props";

const startPlaceholderIcon = placeholderIcon("root", "SlotStart");
const endPlaceholderIcon = placeholderIcon("root", "SlotEnd");
const defaultPlaceholderIcon = placeholderIcon("root", "Slot");

export const fastAnchorId = "fast-anchor";
const fastAnchorConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAnchorId],
    definition: fastComponentDefinitions[`${camelCase(fastAnchorId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With target",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAnchorId,
                        data: {
                            href: "https://microsoft.com",
                            target: "_blank",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Hypertext",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
                            appearance: "hypertext",
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
                        data: "Anchor",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Hypertext no href",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAnchorId,
                        data: {
                            appearance: "hypertext",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
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
                        data: "Anchor",
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
                        schemaId: fastAnchorId,
                        data: {
                            href: "#",
                            Slot: [
                                {
                                    id: defaultPlaceholderIcon[1],
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
                        data: "Anchor",
                    },
                    ...defaultPlaceholderIcon[0],
                },
                "root",
            ],
        },
    ],
};

export default fastAnchorConfig;
