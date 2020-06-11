import { fastComponentSchemas, textSchema } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/anchor/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastAnchorId = "fast-anchor";
const fastAnchorConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAnchorId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastAnchorId,
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
                        data: "Anchor",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastAnchorConfig;
