import { TextArea, textAreaSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/text-area/guidance";
import { ComponentViewConfig } from "./data.props";

const textAreaConfig: ComponentViewConfig = {
    schema: textAreaSchema,
    component: TextArea,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: textAreaSchema.id,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Placeholder",
            dataDictionary: [
                {
                    root: {
                        schemaId: textAreaSchema.id,
                        data: {
                            placeholder: "Placeholder",
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Disabled",
            dataDictionary: [
                {
                    root: {
                        schemaId: textAreaSchema.id,
                        data: {
                            disabled: true,
                            placeholder: "Placeholder",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default textAreaConfig;
