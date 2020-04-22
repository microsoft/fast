import {
    NeutralButton,
    neutralButtonSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/neutral-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const neutralButtonConfig: ComponentViewConfig = {
    schema: neutralButtonSchema2,
    component: NeutralButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: neutralButtonSchema2.id,
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
                        data: "Neutral button",
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
                        schemaId: neutralButtonSchema2.id,
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
                        data: "Neutral button",
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
                        schemaId: neutralButtonSchema2.id,
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
                        data: "Neutral button",
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
                        schemaId: neutralButtonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
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
                        data: "Neutral button",
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
                        schemaId: neutralButtonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
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
                        data: "Neutral button",
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

export default neutralButtonConfig;
