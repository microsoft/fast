import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/breadcrumb/guidance";
import { placeholderIcon } from "../utilities/icons";
import { ComponentViewConfig } from "./data.props";

const startPlaceholderIcon1 = placeholderIcon("Slot0", "SlotStart");
const endPlaceholderIcon1 = placeholderIcon("Slot0", "SlotEnd");
const startPlaceholderIcon2 = placeholderIcon("Slot1", "SlotStart");
const endPlaceholderIcon2 = placeholderIcon("Slot1", "SlotEnd");
const startPlaceholderIcon3 = placeholderIcon("Slot2", "SlotStart");
const endPlaceholderIcon3 = placeholderIcon("Slot2", "SlotEnd");

export const fastBreadcrumbId = "fast-breadcrumb";
export const fastBreadcrumbItemId = "fast-breadcrumb-item";
const fastBreadcrumbConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastBreadcrumbId],
    definition: fastComponentDefinitions[`${camelCase(fastBreadcrumbId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastBreadcrumbId,
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
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 1",
                            href: "#",
                        },
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 2",
                            href: "#",
                        },
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadccrumb item 3",
                        },
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
                        schemaId: fastBreadcrumbId,
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
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 1",
                            href: "#",
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon1[1],
                                },
                            ],
                        },
                    },
                    ...startPlaceholderIcon1[0],
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 2",
                            href: "#",
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon2[1],
                                },
                            ],
                        },
                    },
                    ...startPlaceholderIcon2[0],
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadccrumb item 3",
                            SlotStart: [
                                {
                                    id: startPlaceholderIcon3[1],
                                },
                            ],
                        },
                    },
                    ...startPlaceholderIcon3[0],
                },
                "root",
            ],
        },
        {
            displayName: "With end",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastBreadcrumbId,
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
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 1",
                            href: "#",
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon1[1],
                                },
                            ],
                        },
                    },
                    ...endPlaceholderIcon1[0],
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 2",
                            href: "#",
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon2[1],
                                },
                            ],
                        },
                    },
                    ...endPlaceholderIcon2[0],
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadccrumb item 3",
                            SlotEnd: [
                                {
                                    id: endPlaceholderIcon3[1],
                                },
                            ],
                        },
                    },
                    ...endPlaceholderIcon3[0],
                },
                "root",
            ],
        },
        {
            displayName: "With aria-current",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastBreadcrumbId,
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
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 1",
                            href: "#",
                        },
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadcrumb item 2",
                            href: "#",
                        },
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBreadcrumbItemId,
                        data: {
                            name: "Breadccrumb item 3",
                            href: "#",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastBreadcrumbConfig;
