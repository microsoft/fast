import { fastComponentSchemas } from "@microsoft/site-utilities";
import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/accordion/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastAccordionId = "fast-accordion";
export const fastAccordionItemId = "fast-accordion-item";
const fastAccordionConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAccordionId],
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
                                    id: "Slot12"
                                }
                            ]
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
                    Slot12: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotExpandedIcon",
                        },
                        schemaId: "svg",
                        data: {
                            style: "stroke: blue",
                            width: "18",
                            height: "18",
                            viewBox: "0 0 18 18",
                            fill: "none",
                            xmls: "http://www.w3.org/2000/svg",
                            Slot: [
                                {
                                    id: "Slot121",
                                },
                                {
                                    id: "Slot122",
                                },
                                {
                                    id: "Slot123",
                                },
                            ],
                        },
                    },
                    Slot121 : {
                        parent: {
                            id: "Slot12",
                            dataLocation: "Slot",
                        },
                        schemaId: "path",
                        data: {
                            d: "M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                        }
                    },
                    Slot122 : {
                        parent: {
                            id: "Slot12",
                            dataLocation: "Slot",
                        },
                        schemaId: "path",
                        data: {
                            d: "M9 5.44446V12.5556",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                        }
                    },
                    Slot123 : {
                        parent: {
                            id: "Slot12",
                            dataLocation: "Slot",
                        },
                        schemaId: "path",
                        data: {
                            d: "M5.44446 9H12.5556",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                        }
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
                },         
                "root",
            ],
        },
    ],
};

export default fastAccordionConfig;
