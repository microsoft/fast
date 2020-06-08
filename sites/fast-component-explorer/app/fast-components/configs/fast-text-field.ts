import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/text-field/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTextFieldId = "fast-text-field";
const fastTextFieldConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTextFieldId],
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
