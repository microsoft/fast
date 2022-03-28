import { DesignToken } from "@microsoft/fast-foundation";
import { InteractiveSwatchSet } from "./color/recipe";
import { deltaSwatchSet } from "./color/recipes/delta-swatch-set";
import { fillColor, InteractiveColorRecipe, neutralPalette } from "./design-tokens";

const { create } = DesignToken;

function createNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name, cssCustomPropertyName: null });
}

/*export const neutralStrokeRecipe = createNonCss<InteractiveColorRecipe>(
        "neutral-stroke-recipe"
    ).withDefault({
        evaluate: (element: HTMLElement): InteractiveSwatchSet =>
            deltaSwatchSet(
                neutralPalette.getValueFor(element),
                fillColor.getValueFor(element),
                neutralStrokeRestDelta.getValueFor(element),
                neutralStrokeHoverDelta.getValueFor(element),
                neutralStrokeActiveDelta.getValueFor(element),
                neutralStrokeFocusDelta.getValueFor(element)
            ),
    });

    export const neutralStrokeRest = create<Swatch>("neutral-stroke-rest").withDefault(
        (element: HTMLElement) =>
            neutralStrokeRecipe.getValueFor(element).evaluate(element).rest
    );
    export const neutralStrokeHover = create<Swatch>("neutral-stroke-hover").withDefault(
        (element: HTMLElement) =>
            neutralStrokeRecipe.getValueFor(element).evaluate(element).hover
    );
    export const neutralStrokeActive = create<Swatch>("neutral-stroke-active").withDefault(
        (element: HTMLElement) =>
            neutralStrokeRecipe.getValueFor(element).evaluate(element).active
    );
    export const neutralStrokeFocus = create<Swatch>("neutral-stroke-focus").withDefault(
        (element: HTMLElement) =>
            neutralStrokeRecipe.getValueFor(element).evaluate(element).focus
    );
    */
