import React from "react";
import { ActionToggle, ActionToggleAppearance, ActionToggleProps } from "./index";
import schema from "./action-toggle.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema.json";

const examples: ComponentFactoryExample<ActionToggleProps> = {
    name: "Action toggle",
    component: ActionToggle,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        appearance: ActionToggleAppearance.primary,
        selectedContent: "Pause",
        unselectedContent: "Play",
        selectedLabel: "Pause",
        unselectedLabel: "Play",
        selectedGlyph: {
            id: svgSchema.id,
            props: {
                path: SVGGlyph.pause,
            },
        } as any,
        unselectedGlyph: {
            id: svgSchema.id,
            props: {
                path: SVGGlyph.play,
            },
        } as any,
    },
    data: [
        {
            selectedContent: "Pause",
            unselectedContent: "Play",
            selectedLabel: "Pause",
            unselectedLabel: "Play",
            selectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.pause,
                },
            } as any,
            unselectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.play,
                },
            } as any,
            "data-sketch-symbol": "Action toggle",
        },
        {
            appearance: ActionToggleAppearance.justified,
            selectedContent: "Pause",
            unselectedContent: "Play",
            selectedLabel: "Pause",
            unselectedLabel: "Play",
            selectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.pause,
                },
            } as any,
            unselectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.play,
                },
            } as any,
            "data-sketch-symbol": "Action toggle - justified",
        } as any,
        {
            appearance: ActionToggleAppearance.lightweight,
            selectedContent: "Pause",
            unselectedContent: "Play",
            selectedLabel: "Pause",
            unselectedLabel: "Play",
            selectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.pause,
                },
            } as any,
            unselectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.play,
                },
            } as any,
            "data-sketch-symbol": "Action toggle - lightweight",
        } as any,
        {
            appearance: ActionToggleAppearance.outline,
            selectedContent: "Pause",
            unselectedContent: "Play",
            selectedLabel: "Pause",
            unselectedLabel: "Play",
            selectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.pause,
                },
            } as any,
            unselectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.play,
                },
            } as any,
            "data-sketch-symbol": "Action toggle - outline",
        } as any,
        {
            appearance: ActionToggleAppearance.primary,
            selectedContent: "Pause",
            unselectedContent: "Play",
            selectedLabel: "Pause",
            unselectedLabel: "Play",
            selectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.pause,
                },
            } as any,
            unselectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.play,
                },
            } as any,
            "data-sketch-symbol": "Action toggle - primary",
        } as any,
        {
            appearance: ActionToggleAppearance.stealth,
            selectedContent: "Pause",
            unselectedContent: "Play",
            selectedLabel: "Pause",
            unselectedLabel: "Play",
            selectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.pause,
                },
            } as any,
            unselectedGlyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.play,
                },
            } as any,
            "data-sketch-symbol": "Action toggle - stealth",
        } as any,
    ],
};

export default examples;
