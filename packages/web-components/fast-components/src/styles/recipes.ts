import {
    accentBaseColor,
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundLarge,
    neutralDividerRest,
    neutralFill,
    neutralFillCard,
    neutralFillInput,
    neutralFillStealth,
    neutralFillToggle,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForeground,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundToggle,
    neutralForegroundToggleLarge,
    neutralLayerCard,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    neutralOutline,
} from "@microsoft/fast-components-styles-msft";
import { cssCustomPropertyBehaviorFactory } from "../custom-properties";
import { findProvider } from "../design-system-consumer";

export const neutralForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-rest",
    x => neutralForeground(x).rest,
    findProvider
);
export const neutralForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hover",
    x => neutralForeground(x).hover,
    findProvider
);
export const neutralForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-active",
    x => neutralForeground(x).active,
    findProvider
);
export const neutralForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-focus",
    x => neutralForeground(x).focus,
    findProvider
);
export const neutralForegroundToggleBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle",
    neutralForegroundToggle,
    findProvider
);
export const neutralForegroundToggleLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle-large",
    neutralForegroundToggleLarge,
    findProvider
);
export const neutralForegroundHintBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint",
    neutralForegroundHint,
    findProvider
);
export const neutralForegroundHintLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint-large",
    neutralForegroundHintLarge,
    findProvider
);
export const accentForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-rest",
    x => accentForeground(x).rest,
    findProvider
);
export const accentForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-hover",
    x => accentForeground(x).hover,
    findProvider
);
export const accentForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-active",
    x => accentForeground(x).active,
    findProvider
);
export const accentForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-focus",
    x => accentForeground(x).focus,
    findProvider
);
export const accentForegroundCutRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-cut-rest",
    x => accentForegroundCut(x),
    findProvider
);
export const accentForegroundLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-rest",
    x => accentForegroundLarge(x).rest,
    findProvider
);
export const accentForegroundLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-hover",
    x => accentForegroundLarge(x).hover,
    findProvider
);
export const accentForegroundLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-active",
    x => accentForegroundLarge(x).active,
    findProvider
);
export const accentForegroundLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-focus",
    x => accentForegroundLarge(x).focus,
    findProvider
);
export const neutralFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-rest",
    x => neutralFill(x).rest,
    findProvider
);
export const neutralFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-hover",
    x => neutralFill(x).hover,
    findProvider
);
export const neutralFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-active",
    x => neutralFill(x).active,
    findProvider
);
export const neutralFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-focus",
    x => neutralFill(x).focus,
    findProvider
);
export const neutralFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-selected",
    x => neutralFill(x).selected,
    findProvider
);
export const neutralFillStealthRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-rest",
    x => neutralFillStealth(x).rest,
    findProvider
);
export const neutralFillStealthHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-hover",
    x => neutralFillStealth(x).hover,
    findProvider
);
export const neutralFillStealthActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-active",
    x => neutralFillStealth(x).active,
    findProvider
);
export const neutralFillStealthFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-focus",
    x => neutralFillStealth(x).focus,
    findProvider
);
export const neutralFillStealthSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-selected",
    x => neutralFillStealth(x).selected,
    findProvider
);
export const neutralFillToggleRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-rest",
    x => neutralFillToggle(x).rest,
    findProvider
);
export const neutralFillToggleHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-hover",
    x => neutralFillToggle(x).hover,
    findProvider
);
export const neutralFillToggleActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-active",
    x => neutralFillToggle(x).active,
    findProvider
);
export const neutralFillToggleFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-focus",
    x => neutralFillToggle(x).focus,
    findProvider
);
export const neutralFillInputRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-rest",
    x => neutralFillInput(x).rest,
    findProvider
);
export const neutralFillInputHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-hover",
    x => neutralFillInput(x).hover,
    findProvider
);
export const neutralFillInputActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-active",
    x => neutralFillInput(x).active,
    findProvider
);
export const neutralFillInputFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-focus",
    x => neutralFillInput(x).focus,
    findProvider
);
export const accentFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-rest",
    x => accentFill(x).rest,
    findProvider
);
export const accentFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-hover",
    x => accentFill(x).hover,
    findProvider
);
export const accentFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-active",
    x => accentFill(x).active,
    findProvider
);
export const accentFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-focus",
    x => accentFill(x).focus,
    findProvider
);
export const accentFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-selected",
    x => accentFill(x).selected,
    findProvider
);
export const accentFillLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-rest",
    x => accentFillLarge(x).rest,
    findProvider
);
export const accentFillLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-hover",
    x => accentFillLarge(x).hover,
    findProvider
);
export const accentFillLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-active",
    x => accentFillLarge(x).active,
    findProvider
);
export const accentFillLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-focus",
    x => accentFillLarge(x).focus,
    findProvider
);
export const accentFillLargeSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-selected",
    x => accentFillLarge(x).selected,
    findProvider
);
export const neutralFillCardRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-card-rest",
    x => neutralFillCard(x),
    findProvider
);
export const neutralOutlineRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-rest",
    x => neutralOutline(x).rest,
    findProvider
);
export const neutralOutlineHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-hover",
    x => neutralOutline(x).hover,
    findProvider
);
export const neutralOutlineActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-active",
    x => neutralOutline(x).active,
    findProvider
);
export const neutralOutlineFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-focus",
    x => neutralOutline(x).focus,
    findProvider
);
export const neutralDividerRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-divider-rest",
    neutralDividerRest,
    findProvider
);
export const neutralLayerFloatingBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-floating",
    neutralLayerFloating,
    findProvider
);
export const neutralLayerCardBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card",
    neutralLayerCard,
    findProvider
);
export const neutralLayerCardContainerBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card-container",
    neutralLayerCardContainer,
    findProvider
);
export const neutralLayerL1Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1",
    neutralLayerL1,
    findProvider
);
export const neutralLayerL1AltBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1-alt",
    neutralLayerL1Alt,
    findProvider
);
export const neutralLayerL2Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l2",
    neutralLayerL2,
    findProvider
);
export const neutralLayerL3Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l3",
    neutralLayerL3,
    findProvider
);
export const neutralLayerL4Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l4",
    neutralLayerL4,
    findProvider
);
export const neutralFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus",
    neutralFocus,
    findProvider
);
export const neutralFocusInnerAccentBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus-inner-accent",
    neutralFocusInnerAccent(accentBaseColor),
    findProvider
);
