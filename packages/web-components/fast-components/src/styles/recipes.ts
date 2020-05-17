import { cssCustomPropertyBehaviorFactory } from "@microsoft/fast-foundation";
import {
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
} from "../color/index";
import { accentBaseColor } from "../fast-design-system";
import { FASTDesignSystemProvider } from "../design-system-provider/index";

export const neutralForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-rest",
    x => neutralForeground(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hover",
    x => neutralForeground(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-active",
    x => neutralForeground(x).active,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-focus",
    x => neutralForeground(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundToggleBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle",
    neutralForegroundToggle,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundToggleLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle-large",
    neutralForegroundToggleLarge,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundHintBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint",
    neutralForegroundHint,
    FASTDesignSystemProvider.findProvider
);
export const neutralForegroundHintLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint-large",
    neutralForegroundHintLarge,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-rest",
    x => accentForeground(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-hover",
    x => accentForeground(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-active",
    x => accentForeground(x).active,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-focus",
    x => accentForeground(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundCutRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-cut-rest",
    x => accentForegroundCut(x),
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-rest",
    x => accentForegroundLarge(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-hover",
    x => accentForegroundLarge(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-active",
    x => accentForegroundLarge(x).active,
    FASTDesignSystemProvider.findProvider
);
export const accentForegroundLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-focus",
    x => accentForegroundLarge(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-rest",
    x => neutralFill(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-hover",
    x => neutralFill(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-active",
    x => neutralFill(x).active,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-focus",
    x => neutralFill(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-selected",
    x => neutralFill(x).selected,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillStealthRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-rest",
    x => neutralFillStealth(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillStealthHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-hover",
    x => neutralFillStealth(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillStealthActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-active",
    x => neutralFillStealth(x).active,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillStealthFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-focus",
    x => neutralFillStealth(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillStealthSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-selected",
    x => neutralFillStealth(x).selected,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillToggleRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-rest",
    x => neutralFillToggle(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillToggleHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-hover",
    x => neutralFillToggle(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillToggleActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-active",
    x => neutralFillToggle(x).active,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillToggleFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-focus",
    x => neutralFillToggle(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillInputRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-rest",
    x => neutralFillInput(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillInputHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-hover",
    x => neutralFillInput(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillInputActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-active",
    x => neutralFillInput(x).active,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillInputFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-focus",
    x => neutralFillInput(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const accentFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-rest",
    x => accentFill(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const accentFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-hover",
    x => accentFill(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const accentFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-active",
    x => accentFill(x).active,
    FASTDesignSystemProvider.findProvider
);
export const accentFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-focus",
    x => accentFill(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const accentFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-selected",
    x => accentFill(x).selected,
    FASTDesignSystemProvider.findProvider
);
export const accentFillLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-rest",
    x => accentFillLarge(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const accentFillLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-hover",
    x => accentFillLarge(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const accentFillLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-active",
    x => accentFillLarge(x).active,
    FASTDesignSystemProvider.findProvider
);
export const accentFillLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-focus",
    x => accentFillLarge(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const accentFillLargeSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-selected",
    x => accentFillLarge(x).selected,
    FASTDesignSystemProvider.findProvider
);
export const neutralFillCardRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-card-rest",
    x => neutralFillCard(x),
    FASTDesignSystemProvider.findProvider
);
export const neutralOutlineRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-rest",
    x => neutralOutline(x).rest,
    FASTDesignSystemProvider.findProvider
);
export const neutralOutlineHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-hover",
    x => neutralOutline(x).hover,
    FASTDesignSystemProvider.findProvider
);
export const neutralOutlineActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-active",
    x => neutralOutline(x).active,
    FASTDesignSystemProvider.findProvider
);
export const neutralOutlineFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-focus",
    x => neutralOutline(x).focus,
    FASTDesignSystemProvider.findProvider
);
export const neutralDividerRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-divider-rest",
    neutralDividerRest,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerFloatingBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-floating",
    neutralLayerFloating,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerCardBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card",
    neutralLayerCard,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerCardContainerBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card-container",
    neutralLayerCardContainer,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerL1Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1",
    neutralLayerL1,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerL1AltBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1-alt",
    neutralLayerL1Alt,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerL2Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l2",
    neutralLayerL2,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerL3Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l3",
    neutralLayerL3,
    FASTDesignSystemProvider.findProvider
);
export const neutralLayerL4Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l4",
    neutralLayerL4,
    FASTDesignSystemProvider.findProvider
);
export const neutralFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus",
    neutralFocus,
    FASTDesignSystemProvider.findProvider
);
export const neutralFocusInnerAccentBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus-inner-accent",
    neutralFocusInnerAccent(accentBaseColor),
    FASTDesignSystemProvider.findProvider
);
