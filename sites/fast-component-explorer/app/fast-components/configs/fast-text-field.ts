import Guidance from "../../.tmp/text-field/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastTextFieldId = "fast-text-field";
const fastTextFieldConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastTextFieldId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastTextFieldId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTextFieldConfig;
