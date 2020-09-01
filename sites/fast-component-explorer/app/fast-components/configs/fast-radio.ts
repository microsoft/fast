import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/radio/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastRadioId = "fast-radio";
const fastRadioConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastRadioId],
    definition: fastComponentDefinitions[`${camelCase(fastRadioId)}Definition`],
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
