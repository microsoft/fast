import { ColorPicker } from "./color-picker";
/**
 *
 * @public
 * @remarks
 * HTML Element: \<color-picker\>
 */
export declare const fastToolingColorPicker: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<{
        baseName: string;
        template: (
            context: import("@microsoft/fast-foundation").ElementDefinitionContext
        ) => import("@microsoft/fast-element").ViewTemplate<ColorPicker, any>;
        styles: (
            context: any,
            definition: any
        ) => import("@microsoft/fast-element").ElementStyles;
    }>
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    {
        baseName: string;
        template: (
            context: import("@microsoft/fast-foundation").ElementDefinitionContext
        ) => import("@microsoft/fast-element").ViewTemplate<ColorPicker, any>;
        styles: (
            context: any,
            definition: any
        ) => import("@microsoft/fast-element").ElementStyles;
    },
    typeof ColorPicker
>;
