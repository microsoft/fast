import { create, createNonCss } from "./create.js";

/**
 * A recipe that evaluates to an elevation treatment, commonly, but not limited to, a box .
 *
 * @public
 */
export interface ElevationRecipe {
    /**
     * Evaluate an elevation treatment.
     *
     * @param element - The element for which to evaluate the recipe
     * @param size - The size of the elevation
     */
    evaluate(element: HTMLElement, size: number): string;
}

/**
 * @public
 */
export const elevationRecipe = createNonCss<ElevationRecipe>(
    "elevation-recipe"
).withDefault({
    evaluate: (element: HTMLElement, size: number): string => {
        let ambientOpacity = 0.12;
        let directionalOpacity = 0.14;

        if (size > 16) {
            ambientOpacity = 0.2;
            directionalOpacity = 0.24;
        }

        const ambient = `0 0 2px rgba(0, 0, 0, ${ambientOpacity})`;
        const directional = `0 calc(${size} * 0.5px) calc((${size} * 1px)) rgba(0, 0, 0, ${directionalOpacity})`;
        return `${ambient}, ${directional}`;
    },
});

/** @public */
export const elevationCardRestSize = createNonCss<number>(
    "elevation-card-rest-size"
).withDefault(4);

/** @public */
export const elevationCardHoverSize = createNonCss<number>(
    "elevation-card-hover-size"
).withDefault(8);

/** @public */
export const elevationCardActiveSize = createNonCss<number>(
    "elevation-card-active-size"
).withDefault(2);

/** @public */
export const elevationCardFocusSize = createNonCss<number>(
    "elevation-card-focus-size"
).withDefault(4);

/** @public */
export const elevationCardRest = create<string>(
    "elevation-card-rest"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationCardRestSize.getValueFor(element))
);

/** @public */
export const elevationCardHover = create<string>(
    "elevation-card-hover"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationCardHoverSize.getValueFor(element))
);

/** @public */
export const elevationCardActive = create<string>(
    "elevation-card-active"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationCardActiveSize.getValueFor(element))
);

/** @public */
export const elevationCardFocus = create<string>(
    "elevation-card-focus"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationCardFocusSize.getValueFor(element))
);

/** @public */
export const elevationTooltipSize = createNonCss<number>(
    "elevation-tooltip-size"
).withDefault(16);

/** @public */
export const elevationTooltip = create<string>(
    "elevation-tooltip"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationTooltipSize.getValueFor(element))
);

/** @public */
export const elevationFlyoutSize = createNonCss<number>(
    "elevation-flyout-size"
).withDefault(32);

/** @public */
export const elevationFlyout = create<string>(
    "elevation-flyout"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationFlyoutSize.getValueFor(element))
);

/** @public */
export const elevationDialogSize = createNonCss<number>(
    "elevation-dialog-size"
).withDefault(128);

/** @public */
export const elevationDialog = create<string>(
    "elevation-dialog"
).withDefault((element: HTMLElement) =>
    elevationRecipe
        .getValueFor(element)
        .evaluate(element, elevationDialogSize.getValueFor(element))
);
