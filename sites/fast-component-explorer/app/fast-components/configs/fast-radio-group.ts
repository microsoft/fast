import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/radio-group/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";
import { fastRadioId } from "./fast-radio";
import { labelSchema } from "../../utilities";

// <fast-radio-group name="numbers">
// <label slot="label">Numbers</label>
//             <fast-radio value="one">One</fast-radio>
//             <fast-radio value="two">Two</fast-radio>

export const fastRadioGroupId = "fast-radio-group";
const fastRadioGroupConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastRadioGroupId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastRadioGroupId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                            ],
                            SlotLabel: [
                                {
                                    id: "Slot0",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotLabel",
                        },
                        schemaId: labelSchema.id,
                        data: {
                            Slot: [
                                {
                                    id: "Slot00",
                                },
                            ],
                        },
                    },
                    Slot00: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Group label",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastRadioId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
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
                        data: "Radio label 2",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastRadioId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot20",
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
                        data: "Radio label 2",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastRadioGroupConfig;
