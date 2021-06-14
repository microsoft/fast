import { cssCustomPropertyBehaviorFactory } from "@microsoft/fast-foundation";
import {
    neutralFill_DEPRECATED,
    neutralFillStealth_DEPRECATED,
    neutralFillToggle_DEPRECATED,
    neutralFocus_DEPRECATED,
    neutralFocusInnerAccent_DEPRECATED,
    neutralForeground_DEPRECATED,
    neutralForegroundHint_DEPRECATED,
    neutralForegroundHintLarge_DEPRECATED,
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
