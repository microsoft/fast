import { Image, imageSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/image/guidance";
import { ComponentViewConfig } from "./data.props";

const imageConfig: ComponentViewConfig = {
    schema: imageSchema,
    component: Image,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: imageSchema.id,
                        data: {
                            src: "https://placehold.it/300x300/3E3E3E/171717",
                            alt: "Placeholder image",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default imageConfig;
