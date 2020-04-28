import { AccentButton, accentButtonSchema2 } from "@microsoft/fast-components-react-msft";
import textSchema from "../../msft-component-helpers/text.schema";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../components/glyph";
import { ComponentViewConfig } from "./data.props";

const accentButtonConfig: ComponentViewConfig = {
    schema: accentButtonSchema2,
    component: AccentButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: accentButtonSchema2.id,
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
                        data: "Accent button",
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
                        schemaId: accentButtonSchema2.id,
                        data: {
                            href: "#",
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
                        data: "Accent button",
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
                        schemaId: accentButtonSchema2.id,
                        data: {
                            disabled: true,
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
                        data: "Accent button",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Glyph before text",
            dataDictionary: [
                {
                    root: {
                        schemaId: accentButtonSchema2.id,
                        data: {
                            beforeContent: [
                                {
                                    id: "beforeContent",
                                },
                            ],
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
                        data: "Accent button",
                    },
                    beforeContent: {
                        parent: {
                            id: "root",
                            dataLocation: "beforeContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.user,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Glyph after text",
            dataDictionary: [
                {
                    root: {
                        schemaId: accentButtonSchema2.id,
                        data: {
                            afterContent: [
                                {
                                    id: "afterContent",
                                },
                            ],
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
                        data: "Accent button",
                    },
                    afterContent: {
                        parent: {
                            id: "root",
                            dataLocation: "afterContent",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.arrow,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default accentButtonConfig;
