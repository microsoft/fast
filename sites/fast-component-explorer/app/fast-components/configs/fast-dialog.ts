import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/dialog/guidance";
import { ComponentViewConfig } from "./data.props";
import { fastButtonId } from "./fast-button";

export const fastDialogId = "fast-dialog";
const fastDialogConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastDialogId],
    definition: fastComponentDefinitions[`${camelCase(fastDialogId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastDialogId,
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
                        schemaId: "div",
                        data: {
                            style:
                                "padding: 0 10px 10px; color: var(--neutral-foreground-rest)",
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "Slot",
                            dataLocation: "Slot",
                        },
                        schemaId: "h2",
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
                        data: "Dialog with text and a button.",
                    },
                    Slot1: {
                        parent: {
                            id: "Slot",
                            dataLocation: "Slot",
                        },
                        schemaId: fastButtonId,
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastDialogConfig;
