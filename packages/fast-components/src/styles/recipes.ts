import {
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundLarge,
    DesignSystem,
    neutralDividerRest as neutralDividerRestRecipe,
    neutralFill,
    neutralFillCard,
    neutralFillInput,
    neutralFillStealth,
    neutralFillToggle,
    neutralFocus as neutralFocusRecipe,
    neutralFocusInnerAccent as neutralFocusInnerAccentRecipe,
    neutralForeground,
    neutralForegroundHint as neutralForegroundHintRecipe,
    neutralForegroundHintLarge as neutralForegroundHintLargeRecipe,
    neutralForegroundToggle as neutralForegroundToggleRecipe,
    neutralForegroundToggleLarge as neutralForegroundToggleLargeRecipe,
    neutralLayerCard as neutralLayerCardRecipe,
    neutralLayerCardContainer as neutralLayerCardContainerRecipe,
    neutralLayerFloating as neutralLayerFloatingRecipe,
    neutralLayerL1 as neutralLayerL1Recipe,
    neutralLayerL1Alt as neutralLayerL1AltRecipe,
    neutralLayerL2 as neutralLayerL2Recipe,
    neutralLayerL3 as neutralLayerL3Recipe,
    neutralLayerL4 as neutralLayerL4Recipe,
    neutralOutline,
} from "@microsoft/fast-components-styles-msft";

export interface DesignSystemResolverEntry {
    name: string;
    resolver: (designSystem: DesignSystem) => string | number;
}
export const neutralForegroundRest: DesignSystemResolverEntry = {
    name: "neutral-foreground-rest",
    resolver: x => neutralForeground(x).rest,
};

export const neutralForegroundHover: DesignSystemResolverEntry = {
    name: "neutral-foreground-hover",
    resolver: x => neutralForeground(x).hover,
};

export const neutralForegroundActive: DesignSystemResolverEntry = {
    name: "neutral-foreground-active",
    resolver: x => neutralForeground(x).active,
};

export const neutralForegroundFocus: DesignSystemResolverEntry = {
    name: "neutral-foreground-focus",
    resolver: x => neutralForeground(x).focus,
};

export const neutralForegroundToggle: DesignSystemResolverEntry = {
    name: "neutral-foreground-toggle",
    resolver: neutralForegroundToggleRecipe,
};

export const neutralForegroundToggleLarge: DesignSystemResolverEntry = {
    name: "neutral-foreground-toggle-large",
    resolver: neutralForegroundToggleLargeRecipe,
};

export const neutralForegroundHint: DesignSystemResolverEntry = {
    name: "neutral-foreground-hint",
    resolver: neutralForegroundHintRecipe,
};

export const neutralForegroundHintLarge: DesignSystemResolverEntry = {
    name: "neutral-foreground-hint-large",
    resolver: neutralForegroundHintLargeRecipe,
};

export const accentForegroundRest: DesignSystemResolverEntry = {
    name: "accent-foreground-rest",
    resolver: x => accentForeground(x).rest,
};

export const accentForegroundHover: DesignSystemResolverEntry = {
    name: "accent-foreground-hover",
    resolver: x => accentForeground(x).hover,
};

export const accentForegroundActive: DesignSystemResolverEntry = {
    name: "accent-foreground-active",
    resolver: x => accentForeground(x).active,
};

export const accentForegroundFocus: DesignSystemResolverEntry = {
    name: "accent-foreground-focus",
    resolver: x => accentForeground(x).focus,
};

export const accentForegroundCutRest: DesignSystemResolverEntry = {
    name: "accent-foreground-cut-rest",
    resolver: x => accentForegroundCut(x),
};

export const accentForegroundLargeRest: DesignSystemResolverEntry = {
    name: "accent-foreground-large-rest",
    resolver: x => accentForegroundLarge(x).rest,
};

export const accentForegroundLargeHover: DesignSystemResolverEntry = {
    name: "accent-foreground-large-hover",
    resolver: x => accentForegroundLarge(x).hover,
};

export const accentForegroundLargeActive: DesignSystemResolverEntry = {
    name: "accent-foreground-large-active",
    resolver: x => accentForegroundLarge(x).active,
};

export const accentForegroundLargeFocus: DesignSystemResolverEntry = {
    name: "accent-foreground-large-focus",
    resolver: x => accentForegroundLarge(x).focus,
};

export const neutralFillRest: DesignSystemResolverEntry = {
    name: "neutral-fill-rest",
    resolver: x => neutralFill(x).rest,
};

export const neutralFillHover: DesignSystemResolverEntry = {
    name: "neutral-fill-hover",
    resolver: x => neutralFill(x).hover,
};

export const neutralFillActive: DesignSystemResolverEntry = {
    name: "neutral-fill-active",
    resolver: x => neutralFill(x).active,
};

export const neutralFillFocus: DesignSystemResolverEntry = {
    name: "neutral-fill-focus",
    resolver: x => neutralFill(x).focus,
};

export const neutralFillSelected: DesignSystemResolverEntry = {
    name: "neutral-fill-selected",
    resolver: x => neutralFill(x).selected,
};

export const neutralFillStealthRest: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-rest",
    resolver: x => neutralFillStealth(x).rest,
};

export const neutralFillStealthHover: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-hover",
    resolver: x => neutralFillStealth(x).hover,
};

export const neutralFillStealthActive: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-active",
    resolver: x => neutralFillStealth(x).active,
};

export const neutralFillStealthFocus: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-focus",
    resolver: x => neutralFillStealth(x).focus,
};

export const neutralFillStealthSelected: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-selected",
    resolver: x => neutralFillStealth(x).selected,
};

export const neutralFillToggleRest: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-rest",
    resolver: x => neutralFillToggle(x).rest,
};

export const neutralFillToggleHover: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-hover",
    resolver: x => neutralFillToggle(x).hover,
};

export const neutralFillToggleActive: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-active",
    resolver: x => neutralFillToggle(x).active,
};

export const neutralFillToggleFocus: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-focus",
    resolver: x => neutralFillToggle(x).focus,
};

export const neutralFillInputRest: DesignSystemResolverEntry = {
    name: "neutral-fill-input-rest",
    resolver: x => neutralFillInput(x).rest,
};

export const neutralFillInputHover: DesignSystemResolverEntry = {
    name: "neutral-fill-input-hover",
    resolver: x => neutralFillInput(x).hover,
};

export const neutralFillInputActive: DesignSystemResolverEntry = {
    name: "neutral-fill-input-active",
    resolver: x => neutralFillInput(x).active,
};

export const neutralFillInputFocus: DesignSystemResolverEntry = {
    name: "neutral-fill-input-focus",
    resolver: x => neutralFillInput(x).focus,
};

export const accentFillRest: DesignSystemResolverEntry = {
    name: "accent-fill-rest",
    resolver: x => accentFill(x).rest,
};

export const accentFillHover: DesignSystemResolverEntry = {
    name: "accent-fill-hover",
    resolver: x => accentFill(x).hover,
};

export const accentFillActive: DesignSystemResolverEntry = {
    name: "accent-fill-active",
    resolver: x => accentFill(x).active,
};

export const accentFillFocus: DesignSystemResolverEntry = {
    name: "accent-fill-focus",
    resolver: x => accentFill(x).focus,
};

export const accentFillSelected: DesignSystemResolverEntry = {
    name: "accent-fill-selected",
    resolver: x => accentFill(x).selected,
};

export const accentFillLargeRest: DesignSystemResolverEntry = {
    name: "accent-fill-large-rest",
    resolver: x => accentFillLarge(x).rest,
};

export const accentFillLargeHover: DesignSystemResolverEntry = {
    name: "accent-fill-large-hover",
    resolver: x => accentFillLarge(x).hover,
};

export const accentFillLargeActive: DesignSystemResolverEntry = {
    name: "accent-fill-large-active",
    resolver: x => accentFillLarge(x).active,
};

export const accentFillLargeFocus: DesignSystemResolverEntry = {
    name: "accent-fill-large-focus",
    resolver: x => accentFillLarge(x).focus,
};

export const accentFillLargeSelected: DesignSystemResolverEntry = {
    name: "accent-fill-large-selected",
    resolver: x => accentFillLarge(x).selected,
};

export const neutralFillCardRest: DesignSystemResolverEntry = {
    name: "neutral-fill-card-rest",
    resolver: x => neutralFillCard(x),
};

export const neutralOutlineRest: DesignSystemResolverEntry = {
    name: "neutral-outline-rest",
    resolver: x => neutralOutline(x).rest,
};

export const neutralOutlineHover: DesignSystemResolverEntry = {
    name: "neutral-outline-hover",
    resolver: x => neutralOutline(x).hover,
};

export const neutralOutlineActive: DesignSystemResolverEntry = {
    name: "neutral-outline-active",
    resolver: x => neutralOutline(x).active,
};

export const neutralOutlineFocus: DesignSystemResolverEntry = {
    name: "neutral-outline-focus",
    resolver: x => neutralOutline(x).focus,
};

export const neutralDividerRest: DesignSystemResolverEntry = {
    name: "neutral-divider-rest",
    resolver: neutralDividerRestRecipe,
};

export const neutralLayerFloating: DesignSystemResolverEntry = {
    name: "neutral-layer-floating",
    resolver: neutralLayerFloatingRecipe,
};

export const neutralLayerCard: DesignSystemResolverEntry = {
    name: "neutral-layer-card",
    resolver: neutralLayerCardRecipe,
};

export const neutralLayerCardContainer: DesignSystemResolverEntry = {
    name: "neutral-layer-card-container",
    resolver: neutralLayerCardContainerRecipe,
};

export const neutralLayerL1: DesignSystemResolverEntry = {
    name: "neutral-layer-l1",
    resolver: neutralLayerL1Recipe,
};

export const neutralLayerL1Alt: DesignSystemResolverEntry = {
    name: "neutral-layer-l1-alt",
    resolver: neutralLayerL1AltRecipe,
};

export const neutralLayerL2: DesignSystemResolverEntry = {
    name: "neutral-layer-l2",
    resolver: neutralLayerL2Recipe,
};

export const neutralLayerL3: DesignSystemResolverEntry = {
    name: "neutral-layer-l3",
    resolver: neutralLayerL3Recipe,
};

export const neutralLayerL4: DesignSystemResolverEntry = {
    name: "neutral-layer-l4",
    resolver: neutralLayerL4Recipe,
};

export const neutralFocus: DesignSystemResolverEntry = {
    name: "neutral-focus",
    resolver: neutralFocusRecipe,
};

export const neutralFocusInnerAccent: DesignSystemResolverEntry = {
    name: "neutral-focus-inner-accent",
    resolver: x => neutralFocusInnerAccentRecipe(() => x.accentBaseColor)(x),
};
