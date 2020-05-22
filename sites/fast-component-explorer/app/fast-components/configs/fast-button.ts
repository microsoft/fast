import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/button/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

export const fastButtonId = "fast-button";
const fastButtonConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastButtonId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastButtonId,
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
                        data: "Button",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastButtonConfig;
