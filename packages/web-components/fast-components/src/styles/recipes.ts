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
import { DesignSystemProvider } from "../design-system-provider";

export const neutralForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-rest",
    x => neutralForeground(x).rest,
    DesignSystemProvider.findProvider
);
export const neutralForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hover",
    x => neutralForeground(x).hover,
    DesignSystemProvider.findProvider
);
export const neutralForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-active",
    x => neutralForeground(x).active,
    DesignSystemProvider.findProvider
);
export const neutralForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-focus",
    x => neutralForeground(x).focus,
    DesignSystemProvider.findProvider
);
export const neutralForegroundToggleBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle",
    neutralForegroundToggle,
    DesignSystemProvider.findProvider
);
export const neutralForegroundToggleLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle-large",
    neutralForegroundToggleLarge,
    DesignSystemProvider.findProvider
);
export const neutralForegroundHintBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint",
    neutralForegroundHint,
    DesignSystemProvider.findProvider
);
export const neutralForegroundHintLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint-large",
    neutralForegroundHintLarge,
    DesignSystemProvider.findProvider
);
export const accentForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-rest",
    x => accentForeground(x).rest,
    DesignSystemProvider.findProvider
);
export const accentForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-hover",
    x => accentForeground(x).hover,
    DesignSystemProvider.findProvider
);
export const accentForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-active",
    x => accentForeground(x).active,
    DesignSystemProvider.findProvider
);
export const accentForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-focus",
    x => accentForeground(x).focus,
    DesignSystemProvider.findProvider
);
export const accentForegroundCutRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-cut-rest",
    x => accentForegroundCut(x),
    DesignSystemProvider.findProvider
);
export const accentForegroundLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-rest",
    x => accentForegroundLarge(x).rest,
    DesignSystemProvider.findProvider
);
export const accentForegroundLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-hover",
    x => accentForegroundLarge(x).hover,
    DesignSystemProvider.findProvider
);
export const accentForegroundLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-active",
    x => accentForegroundLarge(x).active,
    DesignSystemProvider.findProvider
);
export const accentForegroundLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-focus",
    x => accentForegroundLarge(x).focus,
    DesignSystemProvider.findProvider
);
export const neutralFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-rest",
    x => neutralFill(x).rest,
    DesignSystemProvider.findProvider
);
export const neutralFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-hover",
    x => neutralFill(x).hover,
    DesignSystemProvider.findProvider
);
export const neutralFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-active",
    x => neutralFill(x).active,
    DesignSystemProvider.findProvider
);
export const neutralFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-focus",
    x => neutralFill(x).focus,
    DesignSystemProvider.findProvider
);
export const neutralFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-selected",
    x => neutralFill(x).selected,
    DesignSystemProvider.findProvider
);
export const neutralFillStealthRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-rest",
    x => neutralFillStealth(x).rest,
    DesignSystemProvider.findProvider
);
export const neutralFillStealthHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-hover",
    x => neutralFillStealth(x).hover,
    DesignSystemProvider.findProvider
);
export const neutralFillStealthActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-active",
    x => neutralFillStealth(x).active,
    DesignSystemProvider.findProvider
);
export const neutralFillStealthFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-focus",
    x => neutralFillStealth(x).focus,
    DesignSystemProvider.findProvider
);
export const neutralFillStealthSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-selected",
    x => neutralFillStealth(x).selected,
    DesignSystemProvider.findProvider
);
export const neutralFillToggleRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-rest",
    x => neutralFillToggle(x).rest,
    DesignSystemProvider.findProvider
);
export const neutralFillToggleHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-hover",
    x => neutralFillToggle(x).hover,
    DesignSystemProvider.findProvider
);
export const neutralFillToggleActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-active",
    x => neutralFillToggle(x).active,
    DesignSystemProvider.findProvider
);
export const neutralFillToggleFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-focus",
    x => neutralFillToggle(x).focus,
    DesignSystemProvider.findProvider
);
export const neutralFillInputRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-rest",
    x => neutralFillInput(x).rest,
    DesignSystemProvider.findProvider
);
export const neutralFillInputHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-hover",
    x => neutralFillInput(x).hover,
    DesignSystemProvider.findProvider
);
export const neutralFillInputActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-active",
    x => neutralFillInput(x).active,
    DesignSystemProvider.findProvider
);
export const neutralFillInputFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-focus",
    x => neutralFillInput(x).focus,
    DesignSystemProvider.findProvider
);
export const accentFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-rest",
    x => accentFill(x).rest,
    DesignSystemProvider.findProvider
);
export const accentFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-hover",
    x => accentFill(x).hover,
    DesignSystemProvider.findProvider
);
export const accentFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-active",
    x => accentFill(x).active,
    DesignSystemProvider.findProvider
);
export const accentFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-focus",
    x => accentFill(x).focus,
    DesignSystemProvider.findProvider
);
export const accentFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-selected",
    x => accentFill(x).selected,
    DesignSystemProvider.findProvider
);
export const accentFillLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-rest",
    x => accentFillLarge(x).rest,
    DesignSystemProvider.findProvider
);
export const accentFillLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-hover",
    x => accentFillLarge(x).hover,
    DesignSystemProvider.findProvider
);
export const accentFillLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-active",
    x => accentFillLarge(x).active,
    DesignSystemProvider.findProvider
);
export const accentFillLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-focus",
    x => accentFillLarge(x).focus,
    DesignSystemProvider.findProvider
);
export const accentFillLargeSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-selected",
    x => accentFillLarge(x).selected,
    DesignSystemProvider.findProvider
);
export const neutralFillCardRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-card-rest",
    x => neutralFillCard(x),
    DesignSystemProvider.findProvider
);
export const neutralOutlineRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-rest",
    x => neutralOutline(x).rest,
    DesignSystemProvider.findProvider
);
export const neutralOutlineHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-hover",
    x => neutralOutline(x).hover,
    DesignSystemProvider.findProvider
);
export const neutralOutlineActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-active",
    x => neutralOutline(x).active,
    DesignSystemProvider.findProvider
);
export const neutralOutlineFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-focus",
    x => neutralOutline(x).focus,
    DesignSystemProvider.findProvider
);
export const neutralDividerRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-divider-rest",
    neutralDividerRest,
    DesignSystemProvider.findProvider
);
export const neutralLayerFloatingBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-floating",
    neutralLayerFloating,
    DesignSystemProvider.findProvider
);
export const neutralLayerCardBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card",
    neutralLayerCard,
    DesignSystemProvider.findProvider
);
export const neutralLayerCardContainerBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card-container",
    neutralLayerCardContainer,
    DesignSystemProvider.findProvider
);
export const neutralLayerL1Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1",
    neutralLayerL1,
    DesignSystemProvider.findProvider
);
export const neutralLayerL1AltBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1-alt",
    neutralLayerL1Alt,
    DesignSystemProvider.findProvider
);
export const neutralLayerL2Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l2",
    neutralLayerL2,
    DesignSystemProvider.findProvider
);
export const neutralLayerL3Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l3",
    neutralLayerL3,
    DesignSystemProvider.findProvider
);
export const neutralLayerL4Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l4",
    neutralLayerL4,
    DesignSystemProvider.findProvider
);
export const neutralFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus",
    neutralFocus,
    DesignSystemProvider.findProvider
);
export const neutralFocusInnerAccentBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus-inner-accent",
    neutralFocusInnerAccent(accentBaseColor),
    DesignSystemProvider.findProvider
);
