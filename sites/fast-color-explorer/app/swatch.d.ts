import React from "react";
import { ColorsDesignSystem } from "./design-system";
import { SwatchResolver } from "./recipes";
export declare enum SwatchTypes {
    fill = "fill",
    foreground = "foreground",
    outline = "outline",
}
export interface SwatchClassNameContract {
    swatch: string;
    swatch_icon: string;
    swatch_recipeName: string;
    swatch_hexCode: string;
    swatch__foreground: string;
    swatch__fill: string;
    swatch__outline: string;
}
export interface SwatchManagedClasses {
    managedClasses: SwatchClassNameContract;
}
interface SwatchBaseProps extends SwatchManagedClasses {
    /**
     * The type of recipe the swatch represents
     */
    type: SwatchTypes;
    /**
     * Recipe name - we can't always pull this from the function name
     */
    recipeName: string;
    /**
     * The recipe to derive the fill color of the swatch
     */
    fillRecipe: SwatchResolver;
    /**
     * The recipe to derive text over the control
     */
    foregroundRecipe: SwatchResolver;
    /**
     * The recipe to derive the outline
     */
    outlineRecipe?: SwatchResolver;
}
declare const Swatch: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        SwatchBaseProps,
        SwatchClassNameContract,
        ColorsDesignSystem
    >,
    any
>;
declare type Swatch = InstanceType<typeof Swatch>;
export declare type SwatchProps = Omit<SwatchBaseProps, "managedClasses">;
export { Swatch };
