import { composedParent, DesignToken } from "@microsoft/fast-foundation";
import { designUnit, strokeWidth } from "../design-tokens";

const { create } = DesignToken;

/**
 * A Design Token representing the visual height of a single line of `base`-sized text.
 *
 * @remarks
 * A variant on the type ramp for the common usage of a single line of text as in most components, adjusted for visual size rather than leading between multiple lines.
 *
 * For text-only and icon-only buttons to be the same height, this value should be the same as the icon size.
 *
 * @defaultValue 16px
 *
 * @public
 */
export const typeRampBaseVisualHeight = create<string>(
    "type-ramp-base-visual-height"
).withDefault("16px");

// Component horizontal tokens

/**
 * The design unit multiplier for component density horizontal outer padding.
 *
 * @remarks
 * Ex: `3` to set the base padding to 3 units.
 * May be fractional.
 *
 * @defaultValue 3
 *
 * @public
 */
export const densityComponentHorizontalOuterUnits = create<number>(
    "density-component-horizontal-outer-units"
).withDefault(3);

/**
 * The design unit multiplier for component density horizontal padding between elements.
 *
 * @remarks
 * Ex: `2` to set the base padding to 2 units.
 * May be fractional.
 *
 * @defaultValue 2
 *
 * @public
 */
export const densityComponentHorizontalBetweenUnits = create<number>(
    "density-component-horizontal-between-units"
).withDefault(2);

/**
 * The design unit multiplier for adjustments to component horizontal density tokens, which adds the specified design units to the base setting.
 *
 * @remarks
 * Ex: `1` to increase padding by one unit.
 * May be fractional.
 *
 * @defaultValue 0
 *
 * @public
 */
export const densityComponentHorizontalAdjustmentUnits = create<number>(
    "density-component-horizontal-adjustment-units"
).withDefault(0);

/**
 * The calculated cumulative value for adjustments to component horizontal density relative up the document hierarchy.
 *
 * @remarks
 * To use relative density do not change this value, only consume it in styles.
 * If you want to break the chain of relative density, override this default function with a fixed value.
 *
 * @public
 */
export const densityComponentHorizontalAdjustmentUnitsCumulative = create<number>(
    "density-component-horizontal-adjustment-units-cumulative"
);
densityComponentHorizontalAdjustmentUnitsCumulative.withDefault(
    (element: HTMLElement) => {
        const parent = composedParent(element);
        const valParent = parent
            ? densityComponentHorizontalAdjustmentUnitsCumulative.getValueFor(parent)
            : 0;
        const valThis = densityComponentHorizontalAdjustmentUnits.getValueFor(element);
        return valParent + valThis;
    }
);

/**
 * The raw calculated measurement for outer padding not accounting for border thickness.
 *
 * @remarks
 * Calculated from the base `densityComponentHorizontalOuterUnits`, the adjusted `densityComponentHorizontalAdjustmentUnits` and the `designUnit` size.
 *
 * @public
 */
export const densityComponentHorizontalOuterValue = create<number>(
    "density-component-horizontal-outer-value"
).withDefault(
    (element: HTMLElement) =>
        (densityComponentHorizontalOuterUnits.getValueFor(element) +
            densityComponentHorizontalAdjustmentUnitsCumulative.getValueFor(element)) *
        designUnit.getValueFor(element)
);

/**
 * The calculated measurement for outer padding adjusted for border thickness of `strokeWidth`.
 *
 * @remarks
 * Calculated from `densityComponentHorizontalOuterValue` - `strokeWidth`.
 *
 * @public
 */
export const densityComponentHorizontalOuterPadding = create<number>(
    "density-component-horizontal-outer-padding"
).withDefault(
    (element: HTMLElement) =>
        densityComponentHorizontalOuterValue.getValueFor(element) -
        strokeWidth.getValueFor(element)
);

/**
 * The inverse of the outer padding, used to pull child elements out into density padding.
 *
 * @remarks
 * This is a convenience token to apply negative margins to a child element to pull it out over the container's padding.
 *
 * For example:
 *     <fast-text-field value="Hello">
 *         <fast-button slot="end" class="fill" appearance="accent">
 *             Search
 *         </fast-button>
 *     </fast-text-field>
 *
 *     fast-button.fill {
 *         border-start-start-radius: 0;
 *         border-end-start-radius: 0;
 *         margin-top: calc(${densityComponentVerticalOuterInverse} * 1px);
 *         margin-bottom: calc(${densityComponentVerticalOuterInverse} * 1px);
 *         margin-right: calc(${densityComponentHorizontalOuterInverse} * 1px);
 *     }
 *
 * @public
 */
export const densityComponentHorizontalOuterInverse = create<number>(
    "density-component-horizontal-outer-inverse"
).withDefault(
    (element: HTMLElement) =>
        Math.max(
            densityComponentHorizontalOuterValue.getValueFor(element),
            strokeWidth.getValueFor(element)
        ) * -1
);

/**
 * The calculated measurement for padding between elements within a component.
 *
 * @remarks
 * This is useful as a `gap` for `flex` layouts or as a `margin` on elements next to other elements.
 *
 * For example:
 *     :host .control {
 *         display: inline-flex;
 *         gap: calc(${densityComponentHorizontalBetweenPadding} * 1px);
 *     }
 *
 * @public
 */
export const densityComponentHorizontalBetweenPadding = create<number>(
    "density-component-horizontal-between-padding"
).withDefault(
    (element: HTMLElement) =>
        (densityComponentHorizontalBetweenUnits.getValueFor(element) +
            densityComponentHorizontalAdjustmentUnitsCumulative.getValueFor(element)) *
        designUnit.getValueFor(element)
);

// Component vertical tokens

/** @public */
export const densityComponentVerticalOuterUnits = create<number>(
    "density-component-vertical-outer-units"
).withDefault(2);

/** @public */
export const densityComponentVerticalBetweenUnits = create<number>(
    "density-component-vertical-between-units"
).withDefault(0);

/** @public */
export const densityComponentVerticalAdjustmentUnits = create<number>(
    "density-component-vertical-adjustment-units"
).withDefault(0);

/** @public */
export const densityComponentVerticalAdjustmentUnitsCumulative = create<number>(
    "density-component-vertical-adjustment-units-cumulative"
);
densityComponentVerticalAdjustmentUnitsCumulative.withDefault((element: HTMLElement) => {
    const parent = composedParent(element);
    const valParent = parent
        ? densityComponentVerticalAdjustmentUnitsCumulative.getValueFor(parent)
        : 0;
    const valThis = densityComponentVerticalAdjustmentUnits.getValueFor(element);
    return valParent + valThis;
});

/** @public */
export const densityComponentVerticalOuterValue = create<number>(
    "density-component-vertical-outer-value"
).withDefault(
    (element: HTMLElement) =>
        (densityComponentVerticalOuterUnits.getValueFor(element) +
            densityComponentVerticalAdjustmentUnitsCumulative.getValueFor(element)) *
        designUnit.getValueFor(element)
);

/** @public */
export const densityComponentVerticalOuterPadding = create<number>(
    "density-component-vertical-outer-padding"
).withDefault(
    (element: HTMLElement) =>
        densityComponentVerticalOuterValue.getValueFor(element) -
        strokeWidth.getValueFor(element)
);

/** @public */
export const densityComponentVerticalOuterInverse = create<number>(
    "density-component-vertical-outer-inverse"
).withDefault(
    (element: HTMLElement) =>
        Math.max(
            densityComponentVerticalOuterValue.getValueFor(element),
            strokeWidth.getValueFor(element)
        ) * -1
);

/** @public */
export const densityComponentVerticalBetweenPadding = create<number>(
    "density-component-vertical-between-padding"
).withDefault(
    (element: HTMLElement) =>
        (densityComponentVerticalBetweenUnits.getValueFor(element) +
            densityComponentVerticalAdjustmentUnitsCumulative.getValueFor(element)) *
        designUnit.getValueFor(element)
);
