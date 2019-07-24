export default {
    $schema: "http://json-schema.org/schema#",
    title: "Design System",
    description: "A design system's schema definition.",
    id: "design-system",
    type: "object",
    properties: {
        backgroundColor: {
            title: "Background color",
            type: "string",
            pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            default: "#FFFFFF",
            disabled: true,
        },
        contrast: {
            title: "Contrast",
            type: "number",
            default: 0,
        },
        density: {
            title: "Density",
            type: "number",
            disabled: true,
            enum: [-3, -2, -1, 0, 1, 2, 3],
            default: 0,
        },
        designUnit: {
            title: "Design unit",
            type: "number",
            default: 4,
        },
        baseHeightMultiplier: {
            title: "Base height multiplier",
            type: "number",
            default: 8,
        },
        baseHorizontalSpacingMultiplier: {
            title: "Base horizontal spacing multiplier",
            type: "number",
            default: 3,
        },
        direction: {
            title: "Direction",
            type: "string",
            enum: ["ltr", "rtl"],
            default: "ltr",
            disabled: true,
        },
        fontWeight: {
            title: "Font weight",
            type: "object",
            properties: {
                light: {
                    title: "Light",
                    type: "number",
                    default: 100,
                },
                semilight: {
                    title: "Semilight",
                    type: "number",
                    default: 200,
                },
                normal: {
                    title: "Normal",
                    type: "number",
                    default: 400,
                },
                semibold: {
                    title: "Semibold",
                    type: "number",
                    default: 600,
                },
                bold: {
                    title: "Bold",
                    type: "number",
                    default: 700,
                },
            },
        },
        cornerRadius: {
            title: "Corner radius",
            type: "number",
            default: 2,
        },
        elevatedCornerRadius: {
            title: "Elevated corner radius",
            type: "number",
            default: 4,
        },
        outlineWidth: {
            title: "Outline width",
            type: "number",
            default: 1,
        },
        focusOutlineWidth: {
            title: "Focus outline width",
            type: "number",
            default: 2,
        },
        disabledOpacity: {
            title: "Disabled opacity",
            type: "number",
            default: 0.3,
        },
        accentFillRestDelta: {
            title: "Accent fill rest delta",
            type: "number",
            default: 0,
        },
        accentFillHoverDelta: {
            title: "Accent fill hover delta",
            type: "number",
            default: 2,
        },
        accentFillActiveDelta: {
            title: "Accent fill active delta",
            type: "number",
            default: 4,
        },
        accentFillSelectedDelta: {
            title: "Accent fill selected delta",
            type: "number",
            default: 12,
        },
        accentForegroundRestDelta: {
            title: "Accent foreground rest delta",
            type: "number",
            default: 0,
        },
        accentForegroundHoverDelta: {
            title: "Accent foreground hover delta",
            type: "number",
            default: 4,
        },
        accentForegroundActiveDelta: {
            title: "Accent foreground active delta",
            type: "number",
            default: 8,
        },
        neutralFillRestDelta: {
            title: "Neutral fill rest delta",
            type: "number",
            default: 4,
        },
        neutralFillHoverDelta: {
            title: "Neutral fill hover delta",
            type: "number",
            default: 3,
        },
        neutralFillActiveDelta: {
            title: "Neutral fill active delta",
            type: "number",
            default: 2,
        },
        neutralFillSelectedDelta: {
            title: "Neutral fill selected delta",
            type: "number",
            default: 8,
        },
        neutralFillInputRestDelta: {
            title: "Neutral fill input rest delta",
            type: "number",
            default: 4,
        },
        neutralFillInputHoverDelta: {
            title: "Neutral fill input hover delta",
            type: "number",
            default: 4,
        },
        neutralFillInputActiveDelta: {
            title: "Neutral fill input active delta",
            type: "number",
            default: 4,
        },
        neutralFillInputSelectedDelta: {
            title: "Neutral fill input selected delta",
            type: "number",
            default: 4,
        },
        neutralFillStealthRestDelta: {
            title: "Neutral fill stealth rest delta",
            type: "number",
            default: 0,
        },
        neutralFillStealthHoverDelta: {
            title: "Neutral fill stealth hover delta",
            type: "number",
            default: 3,
        },
        neutralFillStealthActiveDelta: {
            title: "Neutral fill stealth active delta",
            type: "number",
            default: 2,
        },
        neutralFillStealthSelectedDelta: {
            title: "Neutral fill stealth selected delta",
            type: "number",
            default: 8,
        },
        neutralFillCardDelta: {
            title: "Neutral fill card delta",
            type: "number",
            default: 2,
        },
        neutralForegroundHoverDelta: {
            title: "Neutral foreground hover delta",
            type: "number",
            default: 8,
        },
        neutralForegroundActiveDelta: {
            title: "Neutral foreground active delta",
            type: "number",
            default: 16,
        },
        neutralDividerRestDelta: {
            title: "Neutral divider rest delta",
            type: "number",
            default: 6,
        },
        neutralOutlineRestDelta: {
            title: "Neutral outline rest delta",
            type: "number",
            default: 12,
        },
        neutralOutlineHoverDelta: {
            title: "Neutral outline hover delta",
            type: "number",
            default: 24,
        },
        neutralOutlineActiveDelta: {
            title: "Neutral outline active delta",
            type: "number",
            default: 18,
        },
        accentBaseColor: {
            title: "Accent base color",
            type: "string",
            pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            default: "#0078D4",
        },
    },
};
