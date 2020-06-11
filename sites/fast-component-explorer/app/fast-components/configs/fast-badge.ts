import { fastComponentSchemas, textSchema } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/badge/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastBadgeId = "fast-badge";
const fastBadgeConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastBadgeId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastBadgeId,
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
                        data: "Badge",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastBadgeConfig;
