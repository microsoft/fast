import { HTMLRenderLayerNavigation } from "./html-render-layer-navigation";
/**
 *
 * @public
 * @remarks
 * HTML Element: \<html-render-layer-navigation\>
 */
export declare const fastToolingHTMLRenderLayerNavigation: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<{
        baseName: string;
        template: (
            context: import("@microsoft/fast-foundation").ElementDefinitionContext
        ) => import("@microsoft/fast-element").ViewTemplate<
            HTMLRenderLayerNavigation,
            any
        >;
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
        ) => import("@microsoft/fast-element").ViewTemplate<
            HTMLRenderLayerNavigation,
            any
        >;
        styles: (
            context: any,
            definition: any
        ) => import("@microsoft/fast-element").ElementStyles;
    },
    typeof HTMLRenderLayerNavigation
>;
