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
    neutralFocusInnerAccent as neutralFocusInnerAccentRecipe,
    neutralFocus as neutralFocusRecipe,
    neutralForeground,
    neutralForegroundHintLarge as neutralForegroundHintLargeRecipe,
    neutralForegroundHint as neutralForegroundHintRecipe,
    neutralForegroundToggleLarge as neutralForegroundToggleLargeRecipe,
    neutralForegroundToggle as neutralForegroundToggleRecipe,
    neutralLayerCardContainer as neutralLayerCardContainerRecipe,
    neutralLayerCard as neutralLayerCardRecipe,
    neutralLayerFloating as neutralLayerFloatingRecipe,
    neutralLayerL1Alt as neutralLayerL1AltRecipe,
    neutralLayerL1 as neutralLayerL1Recipe,
    neutralLayerL2 as neutralLayerL2Recipe,
    neutralLayerL3 as neutralLayerL3Recipe,
    neutralLayerL4 as neutralLayerL4Recipe,
    neutralOutline,
} from "@microsoft/fast-components-styles-msft";
import { cssCustomPropertyBehaviorFactory } from "../custom-properties";
import { findProvider } from "../design-system-consumer";

export const neutralForegroundRest = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-rest",
    x => neutralForeground(x).rest,
    findProvider
);
export const neutralForegroundHover = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hover",
    x => neutralForeground(x).hover,
    findProvider
);
export const neutralForegroundActive = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-active",
    x => neutralForeground(x).active,
    findProvider
);
export const neutralForegroundFocus = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-focus",
    x => neutralForeground(x).focus,
    findProvider
);
export const neutralForegroundToggle = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle",
    neutralForegroundToggleRecipe,
    findProvider
);
export const neutralForegroundToggleLarge = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle-large",
    neutralForegroundToggleLargeRecipe,
    findProvider
);
export const neutralForegroundHint = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint",
    neutralForegroundHintRecipe,
    findProvider
);
export const neutralForegroundHintLarge = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint-large",
    neutralForegroundHintLargeRecipe,
    findProvider
);
export const accentForegroundRest = cssCustomPropertyBehaviorFactory(
    "accent-foreground-rest",
    x => accentForeground(x).rest,
    findProvider
);
export const accentForegroundHover = cssCustomPropertyBehaviorFactory(
    "accent-foreground-hover",
    x => accentForeground(x).hover,
    findProvider
);
export const accentForegroundActive = cssCustomPropertyBehaviorFactory(
    "accent-foreground-active",
    x => accentForeground(x).active,
    findProvider
);
export const accentForegroundFocus = cssCustomPropertyBehaviorFactory(
    "accent-foreground-focus",
    x => accentForeground(x).focus,
    findProvider
);
export const accentForegroundCutRest = cssCustomPropertyBehaviorFactory(
    "accent-foreground-cut-rest",
    x => accentForegroundCut(x),
    findProvider
);
export const accentForegroundLargeRest = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-rest",
    x => accentForegroundLarge(x).rest,
    findProvider
);
export const accentForegroundLargeHover = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-hover",
    x => accentForegroundLarge(x).hover,
    findProvider
);
export const accentForegroundLargeActive = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-active",
    x => accentForegroundLarge(x).active,
    findProvider
);
export const accentForegroundLargeFocus = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-focus",
    x => accentForegroundLarge(x).focus,
    findProvider
);
export const neutralFillRest = cssCustomPropertyBehaviorFactory(
    "neutral-fill-rest",
    x => neutralFill(x).rest,
    findProvider
);
export const neutralFillHover = cssCustomPropertyBehaviorFactory(
    "neutral-fill-hover",
    x => neutralFill(x).hover,
    findProvider
);
export const neutralFillActive = cssCustomPropertyBehaviorFactory(
    "neutral-fill-active",
    x => neutralFill(x).active,
    findProvider
);
export const neutralFillFocus = cssCustomPropertyBehaviorFactory(
    "neutral-fill-focus",
    x => neutralFill(x).focus,
    findProvider
);
export const neutralFillSelected = cssCustomPropertyBehaviorFactory(
    "neutral-fill-selected",
    x => neutralFill(x).selected,
    findProvider
);
export const neutralFillStealthRest = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-rest",
    x => neutralFillStealth(x).rest,
    findProvider
);
export const neutralFillStealthHover = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-hover",
    x => neutralFillStealth(x).hover,
    findProvider
);
export const neutralFillStealthActive = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-active",
    x => neutralFillStealth(x).active,
    findProvider
);
export const neutralFillStealthFocus = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-focus",
    x => neutralFillStealth(x).focus,
    findProvider
);
export const neutralFillStealthSelected = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-selected",
    x => neutralFillStealth(x).selected,
    findProvider
);
export const neutralFillToggleRest = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-rest",
    x => neutralFillToggle(x).rest,
    findProvider
);
export const neutralFillToggleHover = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-hover",
    x => neutralFillToggle(x).hover,
    findProvider
);
export const neutralFillToggleActive = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-active",
    x => neutralFillToggle(x).active,
    findProvider
);
export const neutralFillToggleFocus = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-focus",
    x => neutralFillToggle(x).focus,
    findProvider
);
export const neutralFillInputRest = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-rest",
    x => neutralFillInput(x).rest,
    findProvider
);
export const neutralFillInputHover = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-hover",
    x => neutralFillInput(x).hover,
    findProvider
);
export const neutralFillInputActive = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-active",
    x => neutralFillInput(x).active,
    findProvider
);
export const neutralFillInputFocus = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-focus",
    x => neutralFillInput(x).focus,
    findProvider
);
export const accentFillRest = cssCustomPropertyBehaviorFactory(
    "accent-fill-rest",
    x => accentFill(x).rest,
    findProvider
);
export const accentFillHover = cssCustomPropertyBehaviorFactory(
    "accent-fill-hover",
    x => accentFill(x).hover,
    findProvider
);
export const accentFillActive = cssCustomPropertyBehaviorFactory(
    "accent-fill-active",
    x => accentFill(x).active,
    findProvider
);
export const accentFillFocus = cssCustomPropertyBehaviorFactory(
    "accent-fill-focus",
    x => accentFill(x).focus,
    findProvider
);
export const accentFillSelected = cssCustomPropertyBehaviorFactory(
    "accent-fill-selected",
    x => accentFill(x).selected,
    findProvider
);
export const accentFillLargeRest = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-rest",
    x => accentFillLarge(x).rest,
    findProvider
);
export const accentFillLargeHover = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-hover",
    x => accentFillLarge(x).hover,
    findProvider
);
export const accentFillLargeActive = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-active",
    x => accentFillLarge(x).active,
    findProvider
);
export const accentFillLargeFocus = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-focus",
    x => accentFillLarge(x).focus,
    findProvider
);
export const accentFillLargeSelected = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-selected",
    x => accentFillLarge(x).selected,
    findProvider
);
export const neutralFillCardRest = cssCustomPropertyBehaviorFactory(
    "neutral-fill-card-rest",
    x => neutralFillCard(x),
    findProvider
);
export const neutralOutlineRest = cssCustomPropertyBehaviorFactory(
    "neutral-outline-rest",
    x => neutralOutline(x).rest,
    findProvider
);
export const neutralOutlineHover = cssCustomPropertyBehaviorFactory(
    "neutral-outline-hover",
    x => neutralOutline(x).hover,
    findProvider
);
export const neutralOutlineActive = cssCustomPropertyBehaviorFactory(
    "neutral-outline-active",
    x => neutralOutline(x).active,
    findProvider
);
export const neutralOutlineFocus = cssCustomPropertyBehaviorFactory(
    "neutral-outline-focus",
    x => neutralOutline(x).focus,
    findProvider
);
export const neutralDividerRest = cssCustomPropertyBehaviorFactory(
    "neutral-divider-rest",
    neutralDividerRestRecipe,
    findProvider
);
export const neutralLayerFloating = cssCustomPropertyBehaviorFactory(
    "neutral-layer-floating",
    neutralLayerFloatingRecipe,
    findProvider
);
export const neutralLayerCard = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card",
    neutralLayerCardRecipe,
    findProvider
);
export const neutralLayerCardContainer = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card-container",
    neutralLayerCardContainerRecipe,
    findProvider
);
export const neutralLayerL1 = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1",
    neutralLayerL1Recipe,
    findProvider
);
export const neutralLayerL1Alt = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1-alt",
    neutralLayerL1AltRecipe,
    findProvider
);
export const neutralLayerL2 = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l2",
    neutralLayerL2Recipe,
    findProvider
);
export const neutralLayerL3 = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l3",
    neutralLayerL3Recipe,
    findProvider
);
export const neutralLayerL4 = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l4",
    neutralLayerL4Recipe,
    findProvider
);
export const neutralFocus = cssCustomPropertyBehaviorFactory(
    "neutral-focus",
    neutralFocusRecipe,
    findProvider
);
export const neutralFocusInnerAccent = cssCustomPropertyBehaviorFactory(
    "neutral-focus-inner-accent",
    x => neutralFocusInnerAccentRecipe(() => x.accentBaseColor)(x),
    findProvider
);
