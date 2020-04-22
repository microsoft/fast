import { Label, labelSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/label/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const checkboxConfig: ComponentViewConfig = {
    schema: labelSchema2,
    component: Label,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: labelSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
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

export default checkboxConfig;
