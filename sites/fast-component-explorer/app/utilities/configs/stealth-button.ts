import {
    StealthButton,
    stealthButtonSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../components/glyph";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const stealthButtonConfig: ComponentViewConfig = {
    schema: stealthButtonSchema2,
    component: StealthButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: stealthButtonSchema2.id,
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
                        data: "Stealth button",
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
                        schemaId: stealthButtonSchema2.id,
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
                        data: "Stealth button",
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
                        schemaId: stealthButtonSchema2.id,
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
                        data: "Stealth button",
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
                        schemaId: stealthButtonSchema2.id,
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
                        data: "Stealth button",
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
                        schemaId: stealthButtonSchema2.id,
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
                        data: "Stealth button",
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

export default stealthButtonConfig;
