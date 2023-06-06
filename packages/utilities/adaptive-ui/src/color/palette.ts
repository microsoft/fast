import { clamp } from "@microsoft/fast-colors";
import { Swatch } from "./swatch.js";
import { binarySearch } from "./utilities/binary-search.js";
import { directionByIsDark } from "./utilities/direction-by-is-dark.js";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Directional values for navigating {@link Swatch}es in {@link Palette}.
 *
 * @public
 */
export const PaletteDirectionValue = Object.freeze({
    /**
     * Move darker, or up the Palette.
     */
    darker: 1,

    /**
     * Move lighter, or down the Palette.
     */
    lighter: -1,
} as const);

/**
 * Directional values for navigating {@link Swatch}es in {@link Palette}.
 *
 * @public
 */
export type PaletteDirectionValue =
    (typeof PaletteDirectionValue)[keyof typeof PaletteDirectionValue];

// I know we like to avoid enums so I tried to make it an object, but I'm not sure how to make this work with the type and function below.
// export const PaletteDirectionValue = {
//     darker: 1,
//     lighter: -1
// } as const;

/**
 * Convenience type to allow a fixed {@link (PaletteDirectionValue:variable)} or a function that resolves to one.
 *
 * @public
 */
export type PaletteDirection = PaletteDirectionValue | (() => PaletteDirectionValue);

/**
 * Gets a fixed {@link (PaletteDirectionValue:variable)} from {@link PaletteDirection} which may be a function that needs to be resolved.
 *
 * @param direction - A fixed palette direction value or a function that resolves to one
 * @returns A fixed palette direction value
 *
 * @public
 */
export function resolvePaletteDirection(
    direction: PaletteDirection
): PaletteDirectionValue {
    if (typeof direction === "function") {
        return direction();
    } else {
        return direction;
    }
}

/**
 * A collection of {@link Swatch}es that form a luminance gradient from light (index 0) to dark.
 *
 * @public
 */
export interface Palette<T extends Swatch = Swatch> {
    /**
     * The Swatch used to create the full palette.
     */
    readonly source: T;

    /**
     * The array of all Swatches from light to dark.
     */
    readonly swatches: ReadonlyArray<T>;

    /**
     * Returns a Swatch from the Palette that most closely meets
     * the `minContrast` ratio for to the `reference`.
     *
     * @param reference - The relative luminance of the reference
     * @param minContrast - The minimum amount of contrast from the `reference`
     * @param initialIndex - Optional starting point for the search
     * @param direction - Optional control for the direction of the search
     * @returns The Swatch that meets the provided contrast
     */
    colorContrast(
        reference: RelativeLuminance,
        minContrast: number,
        initialIndex?: number,
        direction?: PaletteDirection
    ): T;

    /**
     * Returns a Swatch from the Palette that's the specified position and direction away from the `reference`.
     *
     * @param reference - The relative luminance of the reference
     * @param delta - The number of Swatches away from `reference`
     * @param direction - The direction to go from `reference`, 1 goes darker, -1 goes lighter
     */
    delta(reference: RelativeLuminance, delta: number, direction: PaletteDirection): T;

    /**
     * Returns the index of the Palette that most closely matches
     * the provided relative luminance.
     *
     * @param reference - The relative luminance of the reference
     * @returns The index
     */
    closestIndexOf(reference: RelativeLuminance): number;

    /**
     * Gets a Swatch by index. Index is clamped to the limits
     * of the Palette so a Swatch will always be returned.
     *
     * @param index - The index
     * @returns The Swatch
     */
    get(index: number): T;
}

/**
 * A base {@link Palette} with a common implementation of the interface. Use PaletteRGB for an implementation
 * of a palette generation algorithm that is ready to be used directly, or extend this class to generate custom Swatches.
 *
 * @public
 */
export class BasePalette<T extends Swatch> implements Palette<T> {
    /**
     * {@inheritdoc Palette.source}
     */
    readonly source: T;
    /**
     * {@inheritdoc Palette.swatches}
     */
    readonly swatches: ReadonlyArray<T>;

    /**
     * An index pointer to the end of the palette.
     */
    readonly lastIndex: number;

    /**
     * A copy of the `Swatch`es in reverse order, used for optimized searching.
     */
    readonly reversedSwatches: ReadonlyArray<T>;

    /**
     * Cache from `relativeLuminance` to `Swatch` index in the `Palette`.
     */
    readonly closestIndexCache = new Map<number, number>();

    /**
     * Creates a new Palette.
     *
     * @param source - The source color for the Palette
     * @param swatches - All Swatches in the Palette
     */
    constructor(source: T, swatches: ReadonlyArray<T>) {
        this.source = source;
        this.swatches = swatches;

        this.reversedSwatches = Object.freeze([...this.swatches].reverse());
        this.lastIndex = this.swatches.length - 1;
    }

    /**
     * {@inheritdoc Palette.colorContrast}
     */
    colorContrast(
        reference: RelativeLuminance,
        contrastTarget: number,
        initialSearchIndex?: number,
        direction: PaletteDirection = directionByIsDark(reference)
    ): T {
        if (initialSearchIndex === undefined) {
            initialSearchIndex = this.closestIndexOf(reference);
        }

        let source: ReadonlyArray<T> = this.swatches;
        const endSearchIndex = this.lastIndex;
        let startSearchIndex = initialSearchIndex;

        const condition = (value: T) => contrast(reference, value) >= contrastTarget;

        if (direction === PaletteDirectionValue.lighter) {
            source = this.reversedSwatches;
            startSearchIndex = endSearchIndex - startSearchIndex;
        }

        return binarySearch(source, condition, startSearchIndex, endSearchIndex);
    }

    /**
     * {@inheritdoc Palette.delta}
     */
    delta(reference: RelativeLuminance, delta: number, direction: PaletteDirection): T {
        const dir = resolvePaletteDirection(direction);
        return this.get(this.closestIndexOf(reference) + dir * delta);
    }

    /**
     * {@inheritdoc Palette.closestIndexOf}
     */
    closestIndexOf(reference: RelativeLuminance): number {
        if (this.closestIndexCache.has(reference.relativeLuminance)) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return this.closestIndexCache.get(reference.relativeLuminance)!;
        }

        let index = this.swatches.indexOf(reference as T);

        if (index !== -1) {
            this.closestIndexCache.set(reference.relativeLuminance, index);
            return index;
        }

        const closest = this.swatches.reduce((previous, next) =>
            Math.abs(next.relativeLuminance - reference.relativeLuminance) <
            Math.abs(previous.relativeLuminance - reference.relativeLuminance)
                ? next
                : previous
        );

        index = this.swatches.indexOf(closest);
        this.closestIndexCache.set(reference.relativeLuminance, index);

        return index;
    }

    /**
     * {@inheritdoc Palette.get}
     */
    get(index: number): T {
        return this.swatches[index] || this.swatches[clamp(index, 0, this.lastIndex)];
    }
}
