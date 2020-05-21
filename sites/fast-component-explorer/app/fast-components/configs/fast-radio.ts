import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/radio/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastRadioId = "fast-radio";
const fastRadioConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastRadioId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastRadioId,
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
                        data: "Label",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastRadioConfig;
