import {
    LightweightButton,
    lightweightButtonSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/lightweight-button/guidance";
import { glyphSchema, Icon } from "../../components/glyph";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const lightweightButtonConfig: ComponentViewConfig = {
    schema: lightweightButtonSchema2,
    component: LightweightButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: lightweightButtonSchema2.id,
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
                        data: "Lightweight button",
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
                        schemaId: lightweightButtonSchema2.id,
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
                        data: "Lightweight button",
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
                        schemaId: lightweightButtonSchema2.id,
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
                        data: "Lightweight button",
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
                        schemaId: lightweightButtonSchema2.id,
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
                        data: "Lightweight button",
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
                        schemaId: lightweightButtonSchema2.id,
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
                        data: "Lightweight button",
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

export default lightweightButtonConfig;
