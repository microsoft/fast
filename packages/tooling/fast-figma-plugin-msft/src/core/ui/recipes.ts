import { DesignToken } from "@microsoft/fast-foundation";
import {
    accentBaseColor,
    accentFillRest,
    accentForegroundRest,
    accentStrokeControlRest,
    baseLayerLuminance,
    bodyFont,
    controlCornerRadius,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentRest,
    layerCornerRadius,
    neutralBaseColor,
    neutralFillInputAltRest,
    neutralFillInputRest,
    neutralFillLayerAltRest,
    neutralFillLayerRest,
    neutralFillRest,
    neutralFillSecondaryRest,
    neutralFillStealthRest,
    neutralFillStrongRest,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralLayer1,
    neutralLayer2,
    neutralLayer3,
    neutralLayer4,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralStrokeControlRest,
    neutralStrokeDividerRest,
    neutralStrokeInputRest,
    neutralStrokeLayerRest,
    neutralStrokeRest,
    neutralStrokeStrongRest,
    strokeWidth,
    Swatch,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    typeRampMinus2FontSize,
    typeRampMinus2LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
    typeRampPlus4FontSize,
    typeRampPlus4LineHeight,
    typeRampPlus5FontSize,
    typeRampPlus5LineHeight,
    typeRampPlus6FontSize,
    typeRampPlus6LineHeight,
} from "@fluentui/web-components";
import {
    DesignTokenDefinition,
    DesignTokenRegistry,
    DesignTokenType,
    FormControlId,
} from "./design-token-registry";
import { docBaseColor, docFillRest, docForeground } from "./custom-recipes";

interface DesignTokenStore<T> {
    [key: string]: {
        name: string;
        token: DesignToken<T>;
        type?: DesignTokenType;
        formControlId?: string;
    };
}

const designTokens: DesignTokenStore<any> = {
    accentBaseColor: {
        token: accentBaseColor,
        name: "Accent color",
        formControlId: FormControlId.color,
    },
    neutralBaseColor: {
        token: neutralBaseColor,
        name: "Neutral color",
        formControlId: FormControlId.color,
    },
    baseLayerLuminance: { token: baseLayerLuminance, name: "Base layer luminance" },
    fillColor: {
        token: fillColor,
        name: "Fill color",
        formControlId: FormControlId.color,
    },
    docBaseColor: {
        token: docBaseColor,
        name: "Doc color",
        formControlId: FormControlId.color,
    },
};

const layerRecipes: DesignTokenStore<Swatch> = {
    neutralLayerCardContainer: {
        token: neutralLayerCardContainer,
        name: "Card Container",
    },
    neutralLayerFloating: { token: neutralLayerFloating, name: "Floating" },
    neutralLayer1: { token: neutralLayer1, name: "Layer 1 (Primary)" },
    neutralLayer2: { token: neutralLayer2, name: "Layer 2" },
    neutralLayer3: { token: neutralLayer3, name: "Layer 3" },
    neutralLayer4: { token: neutralLayer4, name: "Layer 4" },
};

const fillRecipes: DesignTokenStore<Swatch> = {
    accentFillRest: { token: accentFillRest, name: "Accent" },
    neutralFillRest: { token: neutralFillRest, name: "Neutral" },
    neutralFillLayerRest: { token: neutralFillLayerRest, name: "Neutral Layer" },
    neutralFillLayerAltRest: {
        token: neutralFillLayerAltRest,
        name: "Neutral Layer Alt",
    },
    neutralFillInputRest: { token: neutralFillInputRest, name: "Neutral Input" },
    neutralFillInputAltRest: {
        token: neutralFillInputAltRest,
        name: "Neutral Input Alt",
    },
    neutralFillSecondaryRest: {
        token: neutralFillSecondaryRest,
        name: "Neutral Secondary",
    },
    neutralFillStealthRest: { token: neutralFillStealthRest, name: "Neutral Stealth" },
    neutralFillStrongRest: { token: neutralFillStrongRest, name: "Neutral Strong" },
    docFillRest: { token: docFillRest, name: "Doc" },
};

const strokeRecipes: DesignTokenStore<Swatch> = {
    accentStrokeControlRest: { token: accentStrokeControlRest, name: "Accent Control" },
    focusStrokeOuter: { token: focusStrokeOuter, name: "Focus Outer" },
    focusStrokeInner: { token: focusStrokeInner, name: "Focus Inner" },
    neutralStrokeDividerRest: { token: neutralStrokeDividerRest, name: "Divider" },
    neutralStrokeLayerRest: { token: neutralStrokeLayerRest, name: "Layer" },
    neutralStrokeRest: { token: neutralStrokeRest, name: "Neutral" },
    neutralStrokeStrongRest: { token: neutralStrokeStrongRest, name: "Neutral Strong" },
    neutralStrokeControlRest: {
        token: neutralStrokeControlRest,
        name: "Neutral Control",
    },
    neutralStrokeInputRest: { token: neutralStrokeInputRest, name: "Neutral Input" },
};

const strokeWidthRecipes: DesignTokenStore<number> = {
    strokeWidth: { token: strokeWidth, name: "Stroke width" },
    focusStrokeWidth: { token: focusStrokeWidth, name: "Focus stroke width" },
};

const textFillRecipes: DesignTokenStore<Swatch> = {
    neutralForegroundRest: { token: neutralForegroundRest, name: "Neutral" },
    neutralForegroundHint: { token: neutralForegroundHint, name: "Hint" },
    accentForegroundRest: { token: accentForegroundRest, name: "Accent" },
    foregroundOnAccentRest: { token: foregroundOnAccentRest, name: "On Accent" },
    docForegroundRest: { token: docForeground, name: "Doc" },
};

const cornerRadiusRecipes: DesignTokenStore<number> = {
    controlCornerRadius: { token: controlCornerRadius, name: "Control" },
    layerCornerRadius: { token: layerCornerRadius, name: "Layer" },
};

const textRecipes: DesignTokenStore<any> = {
    bodyFont: { type: DesignTokenType.fontName, token: bodyFont, name: "Font" },
    typeRampPlus6FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampPlus6FontSize,
        name: "Plus 6 font size",
    },
    typeRampPlus6LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampPlus6LineHeight,
        name: "Plus 6 line height",
    },
    typeRampPlus5FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampPlus5FontSize,
        name: "Plus 5 font size",
    },
    typeRampPlus5LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampPlus5LineHeight,
        name: "Plus 5 line height",
    },
    typeRampPlus4FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampPlus4FontSize,
        name: "Plus 4 font size",
    },
    typeRampPlus4LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampPlus4LineHeight,
        name: "Plus 4 line height",
    },
    typeRampPlus3FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampPlus3FontSize,
        name: "Plus 3 font size",
    },
    typeRampPlus3LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampPlus3LineHeight,
        name: "Plus 3 line height",
    },
    typeRampPlus2FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampPlus2FontSize,
        name: "Plus 2 font size",
    },
    typeRampPlus2LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampPlus2LineHeight,
        name: "Plus 2 line height",
    },
    typeRampPlus1FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampPlus1FontSize,
        name: "Plus 1 font size",
    },
    typeRampPlus1LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampPlus1LineHeight,
        name: "Plus 1 line height",
    },
    typeRampBaseFontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampBaseFontSize,
        name: "Base font size",
    },
    typeRampBaseLineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampBaseLineHeight,
        name: "Base line height",
    },
    typeRampMinus1FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampMinus1FontSize,
        name: "Minus 1 font size",
    },
    typeRampMinus1LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampMinus1LineHeight,
        name: "Minus 1 line height",
    },
    typeRampMinus2FontSize: {
        type: DesignTokenType.fontSize,
        token: typeRampMinus2FontSize,
        name: "Minus 2 font size",
    },
    typeRampMinus2LineHeight: {
        type: DesignTokenType.lineHeight,
        token: typeRampMinus2LineHeight,
        name: "Minus 2 line height",
    },
};

function registerStore<T>(
    type: DesignTokenType | null,
    store: DesignTokenStore<T>,
    title: string,
    registry: DesignTokenRegistry
): void {
    Object.keys(store).forEach((key: string) => {
        const entry = store[key];

        const entryType = type || entry.type;
        if (entryType === null) {
            throw `DesignTokenType not specified for ${key}`;
        }

        const definition: DesignTokenDefinition = {
            id: key,
            name: entry.name,
            groupTitle: title,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            type: entryType!,
            formControlId: entry.formControlId,
            token: entry.token,
        };

        registry.register(definition);
    });
}

export const registerTokens = (registry: DesignTokenRegistry) => {
    registerStore(DesignTokenType.designToken, designTokens, "Global tokens", registry);
    // This could be optimized, but some tokens are intended to be modified as well as applied as recipes.
    registerStore(DesignTokenType.designToken, textRecipes, "Text", registry);
    registerStore(
        DesignTokenType.designToken,
        strokeWidthRecipes,
        "Stroke width",
        registry
    );
    registerStore(
        DesignTokenType.designToken,
        cornerRadiusRecipes,
        "Corner radius",
        registry
    );
};

export const registerRecipes = (registry: DesignTokenRegistry) => {
    registerStore(DesignTokenType.layerFill, layerRecipes, "Layer fill", registry);
    registerStore(DesignTokenType.backgroundFill, fillRecipes, "Fill", registry);
    registerStore(
        DesignTokenType.foregroundFill,
        textFillRecipes,
        "Foreground",
        registry
    );
    registerStore(DesignTokenType.strokeFill, strokeRecipes, "Stroke", registry);
    registerStore(
        DesignTokenType.strokeWidth,
        strokeWidthRecipes,
        "Stroke width",
        registry
    );
    registerStore(
        DesignTokenType.cornerRadius,
        cornerRadiusRecipes,
        "Corner radius",
        registry
    );
    registerStore(null, textRecipes, "Text", registry);
};
