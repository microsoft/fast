import { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";
import { create, createNonCss } from "../design-tokens/create.js";
import { Swatch } from "./swatch.js";

/**
 * A recipe that evaluates a single color value.
 *
 * @public
 */
export interface ColorRecipe {
    /**
     * Evaluate a single color value.
     *
     * @param element - The element for which to evaluate the color recipe
     * @param reference - The reference color, implementation defaults to `fillColor`, but sometimes overridden for nested color recipes
     */
    evaluate(element: HTMLElement, reference?: Swatch): Swatch;
}

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export interface InteractiveColorRecipe {
    /**
     * Evaluate an interactive color set.
     *
     * @param element - The element for which to evaluate the color recipe
     * @param reference - The reference color, implementation defaults to `fillColor`, but sometimes overridden for nested color recipes
     */
    evaluate(element: HTMLElement, reference?: Swatch): InteractiveSwatchSet;
}

/**
 * A set of {@link Swatch}es to use for an interactive control's states.
 *
 * @public
 */
export interface InteractiveSwatchSet {
    /**
     * The Swatch to apply to the rest state.
     */
    rest: Swatch;

    /**
     * The Swatch to apply to the hover state.
     */
    hover: Swatch;

    /**
     * The Swatch to apply to the active state.
     */
    active: Swatch;

    /**
     * The Swatch to apply to the focus state.
     */
    focus: Swatch;
}

export interface InteractiveColorTokens {
    /**
     * Interface recipe
     */
    recipe: DesignToken<InteractiveColorRecipe>;

    set: DesignToken<InteractiveSwatchSet>;

    rest: CSSDesignToken<Swatch>;

    hover: CSSDesignToken<Swatch>;

    active: CSSDesignToken<Swatch>;

    focus: CSSDesignToken<Swatch>;
}

export function createInteractiveColorTokens(
    recipe: (element: HTMLElement, reference?: Swatch) => InteractiveSwatchSet,
    name: string
): InteractiveColorTokens {
    const recipeToken = createNonCss<InteractiveColorRecipe>(
        `${name}-recipe`
    ).withDefault({
        evaluate: recipe,
    });

    const setToken = createNonCss<InteractiveSwatchSet>(`${name}-set`).withDefault(
        (element: HTMLElement): InteractiveSwatchSet =>
            recipeToken.getValueFor(element).evaluate(element)
    );

    return {
        recipe: recipeToken,

        set: setToken,

        rest: create<Swatch>(`${name}-rest`).withDefault(
            (element: HTMLElement) => setToken.getValueFor(element).rest
        ),

        hover: create<Swatch>(`${name}-hover`).withDefault(
            (element: HTMLElement) => setToken.getValueFor(element).hover
        ),

        active: create<Swatch>(`${name}-active`).withDefault(
            (element: HTMLElement) => setToken.getValueFor(element).active
        ),

        focus: create<Swatch>(`${name}-focus`).withDefault(
            (element: HTMLElement) => setToken.getValueFor(element).focus
        ),
    };
}
