import { cssCustomPropertyBehaviorFactory } from "@microsoft/fast-foundation";
import {
    neutralForeground_DEPRECATED,
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
