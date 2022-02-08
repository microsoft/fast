import { DesignToken } from "@microsoft/fast-foundation";
import {
    accentBaseColor,
    accentFillRest,
    accentForegroundRest,
    baseLayerLuminance,
    controlCornerRadius,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
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
    neutralStrokeDividerRest,
    neutralStrokeLayerRest,
    neutralStrokeRest,
    neutralStrokeStrongRest,
    Swatch,
} from "@fluentui/web-components";
import {
    DesignTokenDefinition,
    DesignTokenRegistry,
    DesignTokenType,
} from "./design-token-registry";

interface DesignTokenStore<T> {
    [key: string]: {
        token: DesignToken<T>;
        name: string;
    };
}

const designTokens: DesignTokenStore<any> = {
    accentBaseColor: { token: accentBaseColor, name: "Accent color" },
    neutralBaseColor: { token: neutralBaseColor, name: "Neutral color" },
    baseLayerLuminance: { token: baseLayerLuminance, name: "Base layer luminance" },
    fillColor: { token: fillColor, name: "Fill color" },
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
};

const strokeRecipes: DesignTokenStore<Swatch> = {
    // accentStrokeControlRest: { token: accentStrokeControlRest, name: "Accent Control" }, // Gradient
    focusStrokeOuter: { token: focusStrokeOuter, name: "Focus Outer" },
    focusStrokeInner: { token: focusStrokeInner, name: "Focus Inner" },
    neutralStrokeDividerRest: { token: neutralStrokeDividerRest, name: "Divider" },
    neutralStrokeLayerRest: { token: neutralStrokeLayerRest, name: "Layer" },
    neutralStrokeRest: { token: neutralStrokeRest, name: "Neutral" },
    neutralStrokeStrongRest: { token: neutralStrokeStrongRest, name: "Neutral Strong" },
    // neutralStrokeControlRest: { token: neutralStrokeControlRest, name: "Neutral Control" }, // Gradient
    // neutralStrokeInputRest: { token: neutralStrokeInputRest, name: "Neutral Input" }, // Gradient
};

const textFillRecipes: DesignTokenStore<Swatch> = {
    neutralForegroundRest: { token: neutralForegroundRest, name: "Neutral" },
    neutralForegroundHint: { token: neutralForegroundHint, name: "Hint" },
    accentForegroundRest: { token: accentForegroundRest, name: "Accent" },
    foregroundOnAccentRest: { token: foregroundOnAccentRest, name: "On Accent" },
};

const cornerRadiusRecipes: DesignTokenStore<number> = {
    controlCornerRadius: { token: controlCornerRadius, name: "Control" },
    layerCornerRadius: { token: layerCornerRadius, name: "Layer" },
};

function registerStore<T>(
    type: DesignTokenType,
    store: DesignTokenStore<T>,
    title: string,
    registry: DesignTokenRegistry
): void {
    Object.keys(store).forEach((key: string) => {
        const entry = store[key];

        const definition: DesignTokenDefinition = {
            id: key,
            name: entry.name,
            groupTitle: title,
            type,
            token: entry.token,
            evaluate: (element: HTMLElement) => {
                let val = entry.token.getValueFor(element);
                if (typeof (val as any).toColorString === "function") {
                    val = (val as any).toColorString();
                }
                return val;
            },
        };

        registry.register(definition);
    });
}

export const registerTokens = (registry: DesignTokenRegistry) => {
    registerStore(DesignTokenType.designToken, designTokens, "Design token", registry);
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
        DesignTokenType.cornerRadius,
        cornerRadiusRecipes,
        "Corner radius",
        registry
    );
};
