import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase, uniqueId } from "lodash-es";
import { DataDictionary } from "@microsoft/fast-tooling";
import Guidance from "../../.tmp/accordion/guidance";
import { placeholderIcon } from "../utilities/icons";
import { ComponentViewConfig } from "./data.props";

export const fastAccordionId = "fast-accordion";
export const fastAccordionItemId = "fast-accordion-item";
export const fastCheckboxId = "fast-checkbox";
export const fastButtonId = "fast-button";

const defaultPlaceholderIcon1 = placeholderIcon("Slot1End", "Slot");
const defaultPlaceholderIcon2 = placeholderIcon("Slot2End", "Slot");
const defaultPlaceholderIcon3 = placeholderIcon("Slot3End", "Slot");
const defaultPlaceholderIcon4 = placeholderIcon("Slot4End", "Slot");

function expandedIcon(parent: string): DataDictionary<any> {
    const expandedIconID = uniqueId("ExpandedIcon");
    const expandedIconPath1 = uniqueId("ExpandedIconPath1");
    const expandedIconPath2 = uniqueId("ExpandedIconPath2");
    return [
        {
            [expandedIconID]: {
                parent: {
                    id: parent,
                    dataLocation: "SlotExpandedIcon",
                },
                schemaId: "svg",
                data: {
                    style: "stroke: #E62F63",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 18 18",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    Slot: [
                        {
                            id: expandedIconPath1,
                        },
                        {
                            id: expandedIconPath2,
                        },
                    ],
                },
            },
            [expandedIconPath1]: {
                parent: {
                    id: expandedIconID,
                    dataLocation: "Slot",
                },
                schemaId: "path",
                data: {
                    d:
                        "M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                },
            },
            [expandedIconPath2]: {
                parent: {
                    id: expandedIconID,
                    dataLocation: "Slot",
                },
                schemaId: "path",
                data: {
                    d: "M5.44446 9H12.5556",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                },
            },
        },
        expandedIconID,
    ];
}

function collapsedIcon(parent: string): DataDictionary<any> {
    const collapsedIconID = uniqueId("Collapsed");
    const collapsedIconPath1 = uniqueId("CollapsedPath1");
    const collapsedIconPath2 = uniqueId("CollapsedPath2");
    const collapsedIconPath3 = uniqueId("CollapsedPath3");
    return [
        {
            [collapsedIconID]: {
                parent: {
                    id: parent,
                    dataLocation: "SlotCollapsedIcon",
                },
                schemaId: "svg",
                data: {
                    style: "stroke: #E62F63",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 18 18",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    Slot: [
                        {
                            id: collapsedIconPath1,
                        },
                        {
                            id: collapsedIconPath2,
                        },
                        {
                            id: collapsedIconPath3,
                        },
                    ],
                },
            },
            [collapsedIconPath1]: {
                parent: {
                    id: collapsedIconID,
                    dataLocation: "Slot",
                },
                schemaId: "path",
                data: {
                    d:
                        "M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                },
            },
            [collapsedIconPath2]: {
                parent: {
                    id: collapsedIconID,
                    dataLocation: "Slot",
                },
                schemaId: "path",
                data: {
                    d: "M9 5.44446V12.5556",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                },
            },
            [collapsedIconPath3]: {
                parent: {
                    id: collapsedIconID,
                    dataLocation: "Slot",
                },
                schemaId: "path",
                data: {
                    d: "M5.44446 9H12.5556",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                },
            },
        },
        collapsedIconID,
    ];
}

const collapsedIcon1 = collapsedIcon("Slot1");
const collapsedIcon2 = collapsedIcon("Slot2");
const collapsedIcon3 = collapsedIcon("Slot3");
const collapsedIcon4 = collapsedIcon("Slot4");
const expandedIcon1 = expandedIcon("Slot1");
const expandedIcon2 = expandedIcon("Slot2");
const expandedIcon3 = expandedIcon("Slot3");
const expandedIcon4 = expandedIcon("Slot4");

const fastAccordionConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAccordionId],
    definition: fastComponentDefinitions[`${camelCase(fastAccordionId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAccordionId,
                        data: {
                            SlotItem: [
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
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot11",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon1[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon1[1],
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
                        data: "Accordion one content",
                    },
                    Slot11: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
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
                        data: "Accordion one",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot20",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot21",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon2[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon2[1],
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
                        data: "Accordion two content",
                    },
                    Slot21: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot210",
                                },
                            ],
                        },
                    },
                    Slot210: {
                        parent: {
                            id: "Slot21",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion two",
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot30",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot31",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon3[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon3[1],
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
                        data: "Accordion three content",
                    },
                    Slot31: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot310",
                                },
                            ],
                        },
                    },
                    Slot310: {
                        parent: {
                            id: "Slot31",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion three",
                    },
                    Slot4: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot40",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot41",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon4[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon4[1],
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
                        data: "Accordion four content",
                    },
                    Slot41: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot410",
                                },
                            ],
                        },
                    },
                    Slot410: {
                        parent: {
                            id: "Slot41",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion four",
                    },
                    ...collapsedIcon1[0],
                    ...collapsedIcon2[0],
                    ...collapsedIcon3[0],
                    ...collapsedIcon4[0],
                    ...expandedIcon1[0],
                    ...expandedIcon2[0],
                    ...expandedIcon3[0],
                    ...expandedIcon4[0],
                },
                "root",
            ],
        },
        {
            displayName: "With start and end",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAccordionId,
                        data: {
                            SlotItem: [
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
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot11",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon1[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon1[1],
                                },
                            ],
                            SlotStart: [
                                {
                                    id: "Slot1Start",
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: "Slot1End",
                                },
                            ],
                        },
                    },
                    Slot1Start: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotStart",
                        },
                        schemaId: fastCheckboxId,
                        data: {},
                    },
                    Slot1End: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotEnd",
                        },
                        schemaId: fastButtonId,
                        data: {
                            appearance: "stealth",
                            Slot: [
                                {
                                    id: defaultPlaceholderIcon1[1],
                                },
                            ],
                        },
                    },
                    ...defaultPlaceholderIcon1[0],
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion one content",
                    },
                    Slot11: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
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
                        data: "Accordion one",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot20",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot21",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon2[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon2[1],
                                },
                            ],
                            SlotStart: [
                                {
                                    id: "Slot2Start",
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: "Slot2End",
                                },
                            ],
                        },
                    },
                    Slot2Start: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "SlotStart",
                        },
                        schemaId: fastCheckboxId,
                        data: {},
                    },
                    Slot2End: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "SlotEnd",
                        },
                        schemaId: fastButtonId,
                        data: {
                            appearance: "stealth",
                            Slot: [
                                {
                                    id: defaultPlaceholderIcon2[1],
                                },
                            ],
                        },
                    },
                    ...defaultPlaceholderIcon2[0],
                    Slot20: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion two content",
                    },
                    Slot21: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot210",
                                },
                            ],
                        },
                    },
                    Slot210: {
                        parent: {
                            id: "Slot21",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion two",
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot30",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot31",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon3[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon3[1],
                                },
                            ],
                            SlotStart: [
                                {
                                    id: "Slot3Start",
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: "Slot3End",
                                },
                            ],
                        },
                    },
                    Slot3Start: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "SlotStart",
                        },
                        schemaId: fastCheckboxId,
                        data: {},
                    },
                    Slot3End: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "SlotEnd",
                        },
                        schemaId: fastButtonId,
                        data: {
                            appearance: "stealth",
                            Slot: [
                                {
                                    id: defaultPlaceholderIcon3[1],
                                },
                            ],
                        },
                    },
                    ...defaultPlaceholderIcon3[0],
                    Slot30: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion three content",
                    },
                    Slot31: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot310",
                                },
                            ],
                        },
                    },
                    Slot310: {
                        parent: {
                            id: "Slot31",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion three",
                    },
                    Slot4: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot40",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot41",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon4[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon4[1],
                                },
                            ],
                            SlotStart: [
                                {
                                    id: "Slot4Start",
                                },
                            ],
                            SlotEnd: [
                                {
                                    id: "Slot4End",
                                },
                            ],
                        },
                    },
                    Slot4Start: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "SlotStart",
                        },
                        schemaId: fastCheckboxId,
                        data: {},
                    },
                    Slot4End: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "SlotEnd",
                        },
                        schemaId: fastButtonId,
                        data: {
                            appearance: "stealth",
                            Slot: [
                                {
                                    id: defaultPlaceholderIcon4[1],
                                },
                            ],
                        },
                    },
                    ...defaultPlaceholderIcon4[0],
                    Slot40: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion four content",
                    },
                    Slot41: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot410",
                                },
                            ],
                        },
                    },
                    Slot410: {
                        parent: {
                            id: "Slot41",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion four",
                    },
                    ...collapsedIcon1[0],
                    ...collapsedIcon2[0],
                    ...collapsedIcon3[0],
                    ...collapsedIcon4[0],
                    ...expandedIcon1[0],
                    ...expandedIcon2[0],
                    ...expandedIcon3[0],
                    ...expandedIcon4[0],
                },
                "root",
            ],
        },
        {
            displayName: "Single selection",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAccordionId,
                        data: {
                            "expand-mode": "single",
                            SlotItem: [
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
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot11",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon1[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon1[1],
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
                        data: "Accordion one content",
                    },
                    Slot11: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
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
                        data: "Accordion one",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot20",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot21",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon2[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon2[1],
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
                        data: "Accordion two content",
                    },
                    Slot21: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot210",
                                },
                            ],
                        },
                    },
                    Slot210: {
                        parent: {
                            id: "Slot21",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion two",
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot30",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot31",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon3[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon3[1],
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
                        data: "Accordion three content",
                    },
                    Slot31: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot310",
                                },
                            ],
                        },
                    },
                    Slot310: {
                        parent: {
                            id: "Slot31",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion three",
                    },
                    Slot4: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot40",
                                },
                            ],
                            SlotHeading: [
                                {
                                    id: "Slot41",
                                },
                            ],
                            SlotExpandedIcon: [
                                {
                                    id: expandedIcon4[1],
                                },
                            ],
                            SlotCollapsedIcon: [
                                {
                                    id: collapsedIcon4[1],
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
                        data: "Accordion four content",
                    },
                    Slot41: {
                        parent: {
                            id: "Slot4",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "Slot410",
                                },
                            ],
                        },
                    },
                    Slot410: {
                        parent: {
                            id: "Slot41",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion four",
                    },
                    ...collapsedIcon1[0],
                    ...collapsedIcon2[0],
                    ...collapsedIcon3[0],
                    ...collapsedIcon4[0],
                    ...expandedIcon1[0],
                    ...expandedIcon2[0],
                    ...expandedIcon3[0],
                    ...expandedIcon4[0],
                },
                "root",
            ],
        },
    ],
};

export default fastAccordionConfig;
