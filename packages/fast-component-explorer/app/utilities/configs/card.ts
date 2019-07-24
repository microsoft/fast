import { ComponentViewConfig } from "./data.props";
import {
    Card,
    CardProps,
    cardSchema,
    imageSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/card/guidance";

const cardConfig: ComponentViewConfig<CardProps> = {
    schema: cardSchema,
    component: Card,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: [
                    {
                        id: imageSchema.id,
                        props: {
                            src: "https://placehold.it/300x300/414141",
                            alt: "Placeholder image",
                        },
                    },
                ],
            },
        },
    ],
};

export default cardConfig;
