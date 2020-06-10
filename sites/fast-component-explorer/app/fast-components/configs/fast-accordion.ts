import { fastComponentSchemas } from "@microsoft/site-utilities";
import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/accordion/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastAccordionId = "fast-accordion";
export const fastAccordionItemId = "fast-accordion-item";
console.log(fastComponentSchemas[fastAccordionId]);
console.log(fastComponentSchemas[fastAccordionItemId]);
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
                            SlotHeading: [
                                {
                                    id: "Slot10",
                                },
                            ],
                        },
                    },
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "SlotHeading",
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
                            SlotHeading: [
                                {
                                    id: "Slot20",
                                },
                            ],
                        },
                    },
                    Slot20: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "SlotHeading",
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
