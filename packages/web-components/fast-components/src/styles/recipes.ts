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

/**
 * Behavior to resolve and make available the neutral-foreground-rest CSS custom property.
 */
export const neutralForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-rest",
    x => neutralForeground(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-hover CSS custom property.
 */
export const neutralForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hover",
    x => neutralForeground(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-active CSS custom property.
 */
export const neutralForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-active",
    x => neutralForeground(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-focus CSS custom property.
 */
export const neutralForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-focus",
    x => neutralForeground(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-toggle CSS custom property.
 */
export const neutralForegroundToggleBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle",
    neutralForegroundToggle,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-toggle-large CSS custom property.
 */
export const neutralForegroundToggleLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle-large",
    neutralForegroundToggleLarge,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-hint CSS custom property.
 */
export const neutralForegroundHintBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint",
    neutralForegroundHint,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-hint-large CSS custom property.
 */
export const neutralForegroundHintLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint-large",
    neutralForegroundHintLarge,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-rest CSS custom property.
 */
export const accentForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-rest",
    x => accentForeground(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-hover CSS custom property.
 */
export const accentForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-hover",
    x => accentForeground(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-active CSS custom property.
 */
export const accentForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-active",
    x => accentForeground(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-focus CSS custom property.
 */
export const accentForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-focus",
    x => accentForeground(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-cut-rest CSS custom property.
 */
export const accentForegroundCutRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-cut-rest",
    x => accentForegroundCut(x),
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-rest CSS custom property.
 */
export const accentForegroundLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-rest",
    x => accentForegroundLarge(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-hover CSS custom property.
 */
export const accentForegroundLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-hover",
    x => accentForegroundLarge(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-active CSS custom property.
 */
export const accentForegroundLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-active",
    x => accentForegroundLarge(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-focus CSS custom property.
 */
export const accentForegroundLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-focus",
    x => accentForegroundLarge(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-rest CSS custom property.
 */
export const neutralFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-rest",
    x => neutralFill(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-hover CSS custom property.
 */
export const neutralFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-hover",
    x => neutralFill(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-active CSS custom property.
 */
export const neutralFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-active",
    x => neutralFill(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-focus CSS custom property.
 */
export const neutralFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-focus",
    x => neutralFill(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-selected CSS custom property.
 */
export const neutralFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-selected",
    x => neutralFill(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-rest CSS custom property.
 */
export const neutralFillStealthRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-rest",
    x => neutralFillStealth(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-hover CSS custom property.
 */
export const neutralFillStealthHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-hover",
    x => neutralFillStealth(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-active CSS custom property.
 */
export const neutralFillStealthActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-active",
    x => neutralFillStealth(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-focus CSS custom property.
 */
export const neutralFillStealthFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-focus",
    x => neutralFillStealth(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-selected CSS custom property.
 */
export const neutralFillStealthSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-selected",
    x => neutralFillStealth(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-rest CSS custom property.
 */
export const neutralFillToggleRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-rest",
    x => neutralFillToggle(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-hover CSS custom property.
 */
export const neutralFillToggleHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-hover",
    x => neutralFillToggle(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-active CSS custom property.
 */
export const neutralFillToggleActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-active",
    x => neutralFillToggle(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-focus CSS custom property.
 */
export const neutralFillToggleFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-focus",
    x => neutralFillToggle(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-rest CSS custom property.
 */
export const neutralFillInputRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-rest",
    x => neutralFillInput(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-hover CSS custom property.
 */
export const neutralFillInputHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-hover",
    x => neutralFillInput(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-active CSS custom property.
 */
export const neutralFillInputActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-active",
    x => neutralFillInput(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-focus CSS custom property.
 */
export const neutralFillInputFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-focus",
    x => neutralFillInput(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-rest CSS custom property.
 */
export const accentFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-rest",
    x => accentFill(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-hover CSS custom property.
 */
export const accentFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-hover",
    x => accentFill(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-active CSS custom property.
 */
export const accentFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-active",
    x => accentFill(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-focus CSS custom property.
 */
export const accentFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-focus",
    x => accentFill(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-selected CSS custom property.
 */
export const accentFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-selected",
    x => accentFill(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-rest CSS custom property.
 */
export const accentFillLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-rest",
    x => accentFillLarge(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-hover CSS custom property.
 */
export const accentFillLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-hover",
    x => accentFillLarge(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-active CSS custom property.
 */
export const accentFillLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-active",
    x => accentFillLarge(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-focus CSS custom property.
 */
export const accentFillLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-focus",
    x => accentFillLarge(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-selected CSS custom property.
 */
export const accentFillLargeSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-selected",
    x => accentFillLarge(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-card-rest CSS custom property.
 */
export const neutralFillCardRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-card-rest",
    x => neutralFillCard(x),
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-rest CSS custom property.
 */
export const neutralOutlineRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-rest",
    x => neutralOutline(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-hover CSS custom property.
 */
export const neutralOutlineHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-hover",
    x => neutralOutline(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-active CSS custom property.
 */
export const neutralOutlineActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-active",
    x => neutralOutline(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-focus CSS custom property.
 */
export const neutralOutlineFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-focus",
    x => neutralOutline(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-divider-rest CSS custom property.
 */
export const neutralDividerRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-divider-rest",
    neutralDividerRest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-floating CSS custom property.
 */
export const neutralLayerFloatingBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-floating",
    neutralLayerFloating,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-card CSS custom property.
 */
export const neutralLayerCardBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card",
    neutralLayerCard,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-card-container CSS custom property.
 */
export const neutralLayerCardContainerBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card-container",
    neutralLayerCardContainer,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l1 CSS custom property.
 */
export const neutralLayerL1Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1",
    neutralLayerL1,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l1-alt CSS custom property.
 */
export const neutralLayerL1AltBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1-alt",
    neutralLayerL1Alt,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l2 CSS custom property.
 */
export const neutralLayerL2Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l2",
    neutralLayerL2,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l3 CSS custom property.
 */
export const neutralLayerL3Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l3",
    neutralLayerL3,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l4 CSS custom property.
 */
export const neutralLayerL4Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l4",
    neutralLayerL4,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-focus CSS custom property.
 */
export const neutralFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus",
    neutralFocus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-focus-inner-accent CSS custom property.
 */
export const neutralFocusInnerAccentBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus-inner-accent",
    neutralFocusInnerAccent(accentBaseColor),
    FASTDesignSystemProvider.findProvider
);
