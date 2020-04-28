import { Card, cardSchema2, imageSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/card/guidance";
import { ComponentViewConfig } from "./data.props";

const cardConfig: ComponentViewConfig = {
    schema: cardSchema2,
    component: Card,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: cardSchema2.id,
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
                        schemaId: imageSchema.id,
                        data: {
                            src: "https://placehold.it/300x300/414141",
                            alt: "Placeholder image",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default cardConfig;
