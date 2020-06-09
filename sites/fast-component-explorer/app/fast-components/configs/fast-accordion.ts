import { fastComponentSchemas } from "@microsoft/site-utilities";
import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/accordion/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastAccordionId = "fast-accordion";
export const fastAccordionItemId = "fast-accordion-item";
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
                                    id: "Slot0",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotItem",
                        },
                        schemaId: fastAccordionItemId,
                        data: {
                            SlotHeading: [
                                {
                                    id: "Slot00",
                                },
                            ],
                        },
                    },
                    Slot00: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "SlotHeading",
                        },
                        schemaId: textSchema.id,
                        data: "Accordion one",
                    },
                },         
                "root",
            ],
        },
    ],
};

export default fastAccordionConfig;
