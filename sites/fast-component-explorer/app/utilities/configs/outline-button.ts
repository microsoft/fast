import {
    OutlineButton,
    outlineButtonSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/outline-button/guidance";
import { glyphSchema, Icon } from "../../components/glyph";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const outlineButtonConfig: ComponentViewConfig = {
    schema: outlineButtonSchema2,
    component: OutlineButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: outlineButtonSchema2.id,
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
                        data: "Outline button",
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
                        schemaId: outlineButtonSchema2.id,
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
                        data: "Outline button",
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
                        schemaId: outlineButtonSchema2.id,
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
                        data: "Outline button",
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
                        schemaId: outlineButtonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                            beforeContent: [
                                {
                                    id: "beforeContent",
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
                        data: "Outline button",
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
                        schemaId: outlineButtonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                            afterContent: [
                                {
                                    id: "afterContent",
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
                        data: "Outline button",
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

export default outlineButtonConfig;
