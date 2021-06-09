import { cssCustomPropertyBehaviorFactory } from "@microsoft/fast-foundation";
import {
    accentFill_DEPRECATED,
    accentFillLarge_DEPRECATED,
    accentForeground_DEPRECATED,
    accentForegroundCut_DEPRECATED,
    accentForegroundLarge_DEPRECATED,
    neutralContrastFill_DEPRECATED,
    neutralContrastFillRest_DEPRECATED,
    neutralDividerRest_DEPRECATED,
    neutralFill_DEPRECATED,
    neutralFillCard_DEPRECATED,
    neutralFillInput_DEPRECATED,
    neutralFillStealth_DEPRECATED,
    neutralFillToggle_DEPRECATED,
    neutralFocus_DEPRECATED,
    neutralFocusInnerAccent_DEPRECATED,
    neutralForeground_DEPRECATED,
    neutralForegroundHint_DEPRECATED,
    neutralForegroundHintLarge_DEPRECATED,
    neutralForegroundRest_DEPRECATED,
    neutralForegroundToggle_DEPRECATED,
    neutralForegroundToggleLarge_DEPRECATED,
    neutralLayerCard_DEPRECATED,
    neutralLayerCardContainer_DEPRECATED,
    neutralLayerFloating_DEPRECATED,
    neutralLayerL1_DEPRECATED,
    neutralLayerL1Alt_DEPRECATED,
    neutralLayerL2_DEPRECATED,
    neutralLayerL3_DEPRECATED,
    neutralLayerL4_DEPRECATED,
    neutralOutline_DEPRECATED,
} from "../color/index";
import { FASTDesignSystemProvider } from "../design-system-provider/index";
import { accentBaseColor } from "../fast-design-system";

/**
 * Behavior to resolve and make available the neutral-foreground-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-rest",
    x => neutralForeground_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hover",
    x => neutralForeground_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-active",
    x => neutralForeground_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-focus",
    x => neutralForeground_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-toggle CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundToggleBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle",
    neutralForegroundToggle_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-toggle-large CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundToggleLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-toggle-large",
    neutralForegroundToggleLarge_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-hint CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundHintBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint",
    neutralForegroundHint_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-foreground-hint-large CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralForegroundHintLargeBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-foreground-hint-large",
    neutralForegroundHintLarge_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-rest",
    x => accentForeground_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-hover",
    x => accentForeground_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-active",
    x => accentForeground_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-focus",
    x => accentForeground_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-cut-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundCutRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-cut-rest",
    x => accentForegroundCut_DEPRECATED(x),
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-rest",
    x => accentForegroundLarge_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-hover",
    x => accentForegroundLarge_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-active",
    x => accentForegroundLarge_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-foreground-large-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentForegroundLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-foreground-large-focus",
    x => accentForegroundLarge_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-rest",
    x => neutralFill_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-hover",
    x => neutralFill_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-active",
    x => neutralFill_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-focus",
    x => neutralFill_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-selected CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-selected",
    x => neutralFill_DEPRECATED(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillStealthRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-rest",
    x => neutralFillStealth_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);

/**
 * Behavior to resolve and make available the neutral-fill-stealth-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillStealthHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-hover",
    x => neutralFillStealth_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);

/**
 * Behavior to resolve and make available the neutral-fill-stealth-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillStealthActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-active",
    x => neutralFillStealth_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillStealthFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-focus",
    x => neutralFillStealth_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-stealth-selected CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillStealthSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-stealth-selected",
    x => neutralFillStealth_DEPRECATED(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillToggleRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-rest",
    x => neutralFillToggle_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillToggleHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-hover",
    x => neutralFillToggle_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillToggleActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-active",
    x => neutralFillToggle_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-toggle-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillToggleFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-toggle-focus",
    x => neutralFillToggle_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillInputRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-rest",
    x => neutralFillInput_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillInputHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-hover",
    x => neutralFillInput_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);

/**
 * Behavior to resolve and make available the neutral-fill-input-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillInputActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-active",
    x => neutralFillInput_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-selected CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillInputSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-selected",
    x => neutralFillInput_DEPRECATED(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-input-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillInputFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-input-focus",
    x => neutralFillInput_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-rest",
    x => accentFill_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-hover",
    x => accentFill_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-active",
    x => accentFill_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-focus",
    x => accentFill_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-selected CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-selected",
    x => accentFill_DEPRECATED(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillLargeRestBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-rest",
    x => accentFillLarge_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillLargeHoverBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-hover",
    x => accentFillLarge_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillLargeActiveBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-active",
    x => accentFillLarge_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillLargeFocusBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-focus",
    x => accentFillLarge_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the accent-fill-large-selected CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const accentFillLargeSelectedBehavior = cssCustomPropertyBehaviorFactory(
    "accent-fill-large-selected",
    x => accentFillLarge_DEPRECATED(x).selected,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-fill-card-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFillCardRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-fill-card-rest",
    x => neutralFillCard_DEPRECATED(x),
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralOutlineRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-rest",
    x => neutralOutline_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralOutlineHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-hover",
    x => neutralOutline_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralOutlineActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-active",
    x => neutralOutline_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-outline-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralOutlineFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-outline-focus",
    x => neutralOutline_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-divider-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralDividerRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-divider-rest",
    neutralDividerRest_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-floating CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerFloatingBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-floating",
    neutralLayerFloating_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-card CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerCardBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card",
    neutralLayerCard_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-card-container CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerCardContainerBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-card-container",
    neutralLayerCardContainer_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l1 CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerL1Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1",
    neutralLayerL1_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l1-alt CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerL1AltBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l1-alt",
    neutralLayerL1Alt_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l2 CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerL2Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l2",
    neutralLayerL2_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l3 CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerL3Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l3",
    neutralLayerL3_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-layer-l4 CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralLayerL4Behavior = cssCustomPropertyBehaviorFactory(
    "neutral-layer-l4",
    neutralLayerL4_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus",
    neutralFocus_DEPRECATED,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-focus-inner-accent CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralFocusInnerAccentBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-focus-inner-accent",
    neutralFocusInnerAccent_DEPRECATED(accentBaseColor),
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-contrast-foreground-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralContrastForegroundRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-contrast-foreground-rest",
    x => neutralForegroundRest_DEPRECATED(neutralContrastFillRest_DEPRECATED)(x),
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-contrast-fill-rest CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralContrastFillRestBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-contrast-fill-rest",
    x => neutralContrastFill_DEPRECATED(x).rest,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-contrast-fill-hover CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralContrastFillHoverBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-contrast-fill-hover",
    x => neutralContrastFill_DEPRECATED(x).hover,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-contrast-fill-active CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralContrastFillActiveBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-contrast-fill-active",
    x => neutralContrastFill_DEPRECATED(x).active,
    FASTDesignSystemProvider.findProvider
);
/**
 * Behavior to resolve and make available the neutral-contrast-fill-focus CSS custom property.
 * @public
 * @deprecated - to-be deleted
 */
export const neutralContrastFillFocusBehavior = cssCustomPropertyBehaviorFactory(
    "neutral-contrast-fill-focus",
    x => neutralContrastFill_DEPRECATED(x).focus,
    FASTDesignSystemProvider.findProvider
);
