import { Caption, captionSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/caption/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const captionConfig: ComponentViewConfig = {
    schema: captionSchema2,
    component: Caption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: captionSchema2.id,
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
                        data: "Caption",
                    },
                },
                "root",
            ],
        },
    ],
};

export default captionConfig;
