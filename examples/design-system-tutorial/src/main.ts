import {
    baseLayerLuminance,
    ColorRecipe,
    controlCornerRadius,
    density,
    fastButton,
    fastCard,
    fastTreeItem,
    fastTreeView,
    fillColor,
    neutralFillLayerRecipe,
    neutralPalette,
    PaletteRGB,
    provideFASTDesignSystem,
    StandardLuminance,
    SwatchRGB,
} from "@microsoft/fast-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { html } from "@microsoft/fast-element";
import { demoCard, fastAttribution, Navigation } from "./components";

/**
 * This expression prevents tree-shaking. See the {@link Navigation} definition
 * for more information.
 */
Navigation;

provideFASTDesignSystem().register(
    fastButton(),
    fastCard(),
    fastTreeView(),
    fastTreeItem(),
    fastAttribution(),
    demoCard()
);

const firstCard = document.querySelector("fast-demo-card") as HTMLElement;
const containers = document.querySelectorAll(".container") as NodeListOf<HTMLElement>;
const firstSection = containers[0];
const secondSection = containers[1];

/**
 * Demo 1 - Design Token Default Values
 *
 * Every token in Fast and FAST's design system has a default value. They are set
 * to the system's defaults to start but you can change them by importing the token
 * and calling its 'withDefault' method. Each token is strongly typed so that you can
 * only pass valid values.
 *
 *  Uncomment the code below to change the default control corner radius to 0.
 */

// controlCornerRadius.withDefault(0);

/**
 * Demo 1.5 - Live Design Tokens
 *
 * Design tokens don't just represent static values. They are live. You can change a token
 * at any time during the life of your application.
 *
 * Uncomment the code below to see how we can increase the value of the control
 * corner radius over time.
 */

// let value = 0;
// controlCornerRadius.withDefault(value);
// setInterval(() => controlCornerRadius.withDefault(value += 1), 1000);

/**
 * Demo 2 - Light Mode and Dark Mode
 *
 * The design system's color model is algorithmically based around the concept
 * of "luminance" and "layers". By adjusting the luminance of the base layer,
 * you can switch the design system between light and dark mode, and
 * anywhere in between (luminance is a value from 0 to 1). To simplify the most common
 * luminosity settings, the StandardLuminance helper is provided.
 *
 * Uncomment the code below to switch the design system into dark mode.
 */

// baseLayerLuminance.withDefault(StandardLuminance.LightMode);

/**
 * Demo 3 - Token Values for DOM Trees
 *
 * In addition to being able to set default values for design tokens, you
 * can also set a token value so that it only applies to a specific part of
 * the DOM. Use the setValueFor method of a token to set its value only for the
 * DOM node provided and its descendants.
 *
 * Uncomment the code below to set the fill color only for the first card.
 */

// fillColor.setValueFor(firstCard, (target: HTMLElement) => neutralPalette.getValueFor(target).get(4));

/**
 * Uncomment the code below to set the fill color for the entire first section.
 */

// fillColor.setValueFor(firstSection, (target: HTMLElement) => neutralPalette.getValueFor(target).get(4));

/**
 * Demo 4 - Token Recipes
 *
 * Some color tokens get their values from algorithms we call "recipes". A color recipe is just
 * an object with an 'evaluate' method that returns a Swatch. In the same way that you can change
 * out individual tokens, you can also change recipes that control collections of tokens.
 *
 *
 * Below we change the neutralFillLayerRecipe to simply grab a fixed color lookup from
 * the neutral palette. Changing this recipe will affect all tokens based on the recipe.
 *
 * Uncomment the code below to see how changing the neutralFillLayerRecipe affects the design.
 */

// const recipe: ColorRecipe = {
//     evaluate: (target: HTMLElement) => neutralPalette.getValueFor(target).get(4)
// };
//
// neutralFillLayerRecipe.withDefault(recipe);

/**
 * Demo 5 - Design Overhaul
 *
 * Change as many tokens as you need to get the effect you want.
 * Uncomment the code below to change defaults and sections in various ways.
 */

// controlCornerRadius.withDefault(20);
// density.withDefault(4);
// neutralPalette.withDefault(PaletteRGB.create(SwatchRGB.from(parseColorHexRGB("#0078D4")!)))
// neutralPalette.setValueFor(firstSection, PaletteRGB.create(SwatchRGB.create(0, 1, 0)));
// neutralPalette.setValueFor(secondSection, PaletteRGB.create(SwatchRGB.create(1, 0, 0)));
// baseLayerLuminance.withDefault(StandardLuminance.LightMode);
