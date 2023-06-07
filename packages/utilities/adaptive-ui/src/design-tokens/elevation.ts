import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { ElevationRecipe } from "../elevation/recipe.js";
import { create, createNonCss } from "./create.js";

/**
 * @public
 */
export const elevationRecipe = createNonCss<ElevationRecipe>(
    "elevation-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, size: number): string => {
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
export const elevationCardRest = create<string>("elevation-card-rest").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardRestSize))
);

/** @public */
export const elevationCardHover = create<string>("elevation-card-hover").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardHoverSize))
);

/** @public */
export const elevationCardActive = create<string>("elevation-card-active").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardActiveSize))
);

/** @public */
export const elevationCardFocus = create<string>("elevation-card-focus").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardFocusSize))
);

/** @public */
export const elevationTooltipSize = createNonCss<number>(
    "elevation-tooltip-size"
).withDefault(16);

/** @public */
export const elevationTooltip = create<string>("elevation-tooltip").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationTooltipSize))
);

/** @public */
export const elevationFlyoutSize = createNonCss<number>(
    "elevation-flyout-size"
).withDefault(32);

/** @public */
export const elevationFlyout = create<string>("elevation-flyout").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationFlyoutSize))
);

/** @public */
export const elevationDialogSize = createNonCss<number>(
    "elevation-dialog-size"
).withDefault(128);

/** @public */
export const elevationDialog = create<string>("elevation-dialog").withDefault(resolve =>
    resolve(elevationRecipe).evaluate(resolve, resolve(elevationDialogSize))
);
