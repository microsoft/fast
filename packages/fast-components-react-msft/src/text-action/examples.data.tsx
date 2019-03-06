import React from "react";
import { TextAction, TextActionProps } from "./index";
import schema from "./text-action.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { TextActionButtonPosition } from "./text-action.props";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema.json";
import buttonSchema from "../button/button.schema.json";

const examples: ComponentFactoryExample<TextActionProps> = {
    name: "Text action",
    component: TextAction,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        placeholder: "Placeholder",
        button: {
            id: buttonSchema.id,
            props: {
                disabled: true,
                children: {
                    id: svgSchema.id,
                    props: {
                        path: SVGGlyph.arrow,
                    },
                },
            },
        } as any,
        beforeGlyph: {
            id: svgSchema.id,
            props: {
                path: SVGGlyph.user,
            },
        } as any,
    },
    data: [
        {
            title: "Search",
            button: {
                id: buttonSchema.id,
                props: {
                    disabled: true,
                    children: {
                        id: svgSchema.id,
                        props: {
                            path: SVGGlyph.arrow,
                        },
                    },
                },
            } as any,
            beforeGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.user,
                },
            } as any,
        },
        {
            disabled: true,
            button: {
                id: buttonSchema.id,
                props: {
                    disabled: true,
                    children: {
                        id: svgSchema.id,
                        props: {
                            path: SVGGlyph.arrow,
                        },
                    },
                },
            } as any,
            beforeGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.arrow,
                },
            } as any,
        },
        {
            defaultValue: "foo",
            button: {
                id: buttonSchema.id,
                props: {
                    disabled: true,
                    children: {
                        id: svgSchema.id,
                        props: {
                            path: SVGGlyph.arrow,
                        },
                    },
                },
            } as any,
        },
        {
            button: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.arrow,
                },
            } as any,
            beforeGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.user,
                },
            } as any,
        },
        {
            buttonPosition: TextActionButtonPosition.before,
            button: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.arrow,
                },
            } as any,
            afterGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.download,
                },
            } as any,
        },
        {
            button: {
                id: buttonSchema.id,
                props: {
                    disabled: true,
                    children: {
                        id: svgSchema.id,
                        props: {
                            path: SVGGlyph.arrow,
                        },
                    },
                },
            } as any,
        },
        {
            afterGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.download,
                },
            } as any,
        },
        {
            buttonPosition: TextActionButtonPosition.before,
            button: {
                id: buttonSchema.id,
                props: {
                    disabled: true,
                    children: {
                        id: svgSchema.id,
                        props: {
                            path: SVGGlyph.arrow,
                        },
                    },
                },
            } as any,
            beforeGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.user,
                },
            } as any,
        },
    ],
};

export default examples;
