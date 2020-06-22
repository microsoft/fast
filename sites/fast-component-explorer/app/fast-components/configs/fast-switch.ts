import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/switch/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastSwitchId = "fast-switch";
const fastSwitchConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSwitchId],
    definition: fastComponentDefinitions[`${camelCase(fastSwitchId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSwitchId,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With slot",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSwitchId,
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
                        data: "Dark Mode",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With slot, checked and unchecked message",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSwitchId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                            SlotCheckedMessage: [
                                {
                                    id: "CheckedMessageDiv",
                                },
                            ],
                            SlotUncheckedMessage: [
                                {
                                    id: "UncheckedMessageDiv",
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
                        data: "Theme",
                    },
                    CheckedMessageDiv: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotCheckedMessage",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "CheckedMessage",
                                },
                            ],
                        },
                    },
                    CheckedMessage: {
                        parent: {
                            id: "CheckedMessageDiv",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Light",
                    },
                    UncheckedMessageDiv: {
                        parent: {
                            id: "root",
                            dataLocation: "SlotUncheckedMessage",
                        },
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "UncheckedMessage",
                                },
                            ],
                        },
                    },
                    UncheckedMessage: {
                        parent: {
                            id: "UncheckedMessageDiv",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Dark",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastSwitchConfig;
