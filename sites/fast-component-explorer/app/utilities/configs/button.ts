import {
    Button,
    ButtonAppearance,
    buttonSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/button/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const buttonConfig: ComponentViewConfig = {
    schema: buttonSchema2,
    component: Button,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            dataDictionary: [
                {
                    root: {
                        schemaId: buttonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children0",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Anchor",
            dataDictionary: [
                {
                    root: {
                        schemaId: buttonSchema2.id,
                        data: {
                            href: "#",
                            children: [
                                {
                                    id: "children0",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Button",
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
                        schemaId: buttonSchema2.id,
                        data: {
                            appearance: ButtonAppearance.primary,
                            disabled: true,
                            children: [
                                {
                                    id: "children0",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Button",
                    },
                },
                "root",
            ],
        },
    ],
};

export default buttonConfig;
