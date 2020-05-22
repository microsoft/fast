import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/badge/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

export const fastBadgeId = "fast-badge";
const fastBadgeConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastBadgeId],
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
