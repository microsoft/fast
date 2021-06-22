import {
    ColorRecipe,
    cornerRadius,
    designUnit,
    fastButton,
    fillColor,
    neutralFillLayerRecipe,
    neutralPalette,
    SwatchRGB,
} from "@microsoft/fast-components";
import { css, ElementStyles } from "@microsoft/fast-element";
import {
    DesignSystem,
    DesignToken,
    DI,
    ElementDefinitionContext,
    FoundationElementDefinition,
    OverrideFoundationElementDefinition,
    Registration,
} from "@microsoft/fast-foundation";
import {
    DemoCard,
    demoCardDefinition,
    DemoCardDefinitionOptions,
} from "./components/demo-card";
import { demoCardStyles } from "./components/demo-card/styles";

const root = document.getElementById("root")!;
const firstDemoCard = document.querySelector("fluent-demo-card") as DemoCard;

/**
 * Demo 1
 *
 * @remarks
 * Delete code demo after showing
 */
// designUnit.withDefault(6);

/**
 * Demo 2
 *
 * @remarks
 * Delete code demo after showing
 */
// fillColor.withDefault((target: HTMLElement) => neutralPalette.getValueFor(element).get(73))

/**
 * Demo 3
 *
 * @remarks
 * Delete code demo after showing
 */
// fillColor.setValueFor(firstDemoCard, (target: HTMLElement) => neutralPalette.getValueFor(element).get(73));

/**
 * Demo 4
 *
 * Color Recipe is just an object with an 'evaluate' method that returns a Swatch.
 * Now all uses of neutralFillLayerRecipe (like within a card) use the above recipe to derive a value.
 */
// const recipe: ColorRecipe = {
//     evaluate: (target: HTMLElement) => neutralPalette.getValueFor(target).get(73)
// };
// neutralFillLayerRecipe.withDefault(recipe)

DesignSystem.getOrCreate()
    .withPrefix("fluent")
    .register(fastButton(), demoCardDefinition());
