import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/text-field/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTextFieldId = "fast-text-field";
const fastTextFieldConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTextFieldId],
    definition: fastComponentDefinitions[`${camelCase(fastTextFieldId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastTextFieldId,
                        data: {
                            placeholder: "name",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTextFieldConfig;
