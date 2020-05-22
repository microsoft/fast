import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/checkbox/guidance";
import { webComponentSchemas } from "../";
import { ComponentViewConfig } from "./data.props";

export const fastCheckboxId = "fast-checkbox";
const fastCheckboxConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastCheckboxId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastCheckboxId,
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
                        data: "Checkbox",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastCheckboxConfig;
