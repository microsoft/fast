import { ComponentViewConfig } from "./data.props";
import { Image, ImageProps, imageSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/image/guidance";

const imageConfig: ComponentViewConfig<ImageProps> = {
    schema: imageSchema,
    component: Image,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                src: "https://placehold.it/300x300/3E3E3E/171717",
                alt: "Placeholder image",
            },
        },
    ],
};

export default imageConfig;
