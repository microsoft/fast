import {
    buttonSchema2,
    TextAction,
    TextActionAppearance,
    textActionSchema2,
} from "@microsoft/fast-components-react-msft";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import Guidance from "../../.tmp/text-action/guidance";
import { ComponentViewConfig } from "./data.props";

const textActionConfig: ComponentViewConfig = {
    schema: textActionSchema2,
    component: TextAction,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Filled",
            dataDictionary: [
                {
                    root: {
                        schemaId: textActionSchema2.id,
                        data: {
                            appearance: TextActionAppearance.filled,
                            button: [
                                {
                                    id: "button",
                                },
                            ],
                            beforeGlyph: [
                                {
                                    id: "beforeGlyph",
                                },
                            ],
                        },
                    },
                    button: {
                        parent: {
                            id: "root",
                            dataLocation: "button",
                        },
                        schemaId: buttonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "buttonchildren",
                                },
                            ],
                        },
                    },
                    buttonchildren: {
                        parent: {
                            id: "button",
                            dataLocation: "children",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.arrow,
                        },
                    },
                    beforeGlyph: {
                        parent: {
                            id: "root",
                            dataLocation: "beforeGlyph",
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
            displayName: "Outline",
            dataDictionary: [
                {
                    root: {
                        schemaId: textActionSchema2.id,
                        data: {
                            appearance: TextActionAppearance.outline,
                            button: [
                                {
                                    id: "button",
                                },
                            ],
                            beforeGlyph: [
                                {
                                    id: "beforeGlyph",
                                },
                            ],
                        },
                    },
                    button: {
                        parent: {
                            id: "root",
                            dataLocation: "button",
                        },
                        schemaId: buttonSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "buttonchildren",
                                },
                            ],
                        },
                    },
                    buttonchildren: {
                        parent: {
                            id: "button",
                            dataLocation: "children",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.arrow,
                        },
                    },
                    beforeGlyph: {
                        parent: {
                            id: "root",
                            dataLocation: "beforeGlyph",
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
    ],
};

export default textActionConfig;
