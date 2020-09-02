import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/radio-group/guidance";
import { ComponentViewConfig } from "./data.props";
import { fastRadioId } from "./fast-radio";

export const fastRadioGroupId = "fast-radio-group";
const fastRadioGroupConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastRadioGroupId],
    definition: fastComponentDefinitions[`${camelCase(fastRadioGroupId)}Definition`],
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
                                {
                                    id: "Slot3",
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
                        schemaId: "label",
                        data: {
                            style: "color: var(--neutral-foreground-rest);",
                            slot: "label",
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
                        data: "Radio label 1",
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
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastRadioId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot30",
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
                        data: "Radio label 3",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastRadioGroupConfig;
