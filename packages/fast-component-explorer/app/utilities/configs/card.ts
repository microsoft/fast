import { ComponentViewConfig } from "./data.props";
import {
    Card,
    CardProps,
    cardSchema,
    imageSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/card/guidance";
import API from "../../.tmp/card/api";

const cardConfig: ComponentViewConfig<CardProps> = {
    api: API,
    schema: cardSchema,
    component: Card,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
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
