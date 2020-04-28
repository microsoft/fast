import { Typography, typographySchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/typography/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const typographyConfig: ComponentViewConfig = {
    schema: typographySchema2,
    component: Typography,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: typographySchema2.id,
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
                        data: "Typography",
                    },
                },
                "root",
            ],
        },
    ],
};

export default typographyConfig;
