import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/card/guidance";
import { webComponentSchemas } from "../";
import { imageSchema } from "../../utilities";
import { ComponentViewConfig } from "./data.props";
import { fastBadgeId } from "./fast-badge";

export const fastCardId = "fast-card";
const fastCardConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastCardId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCardId,
                        data: {
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
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: imageSchema.id,
                        data: {
                            src: "https://placehold.it/300x300/414141",
                        },
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBadgeId,
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
                        data: "Card",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastCardConfig;
