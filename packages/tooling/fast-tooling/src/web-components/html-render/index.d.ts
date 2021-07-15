import { HTMLRender } from "./html-render";
/**
 *
 * @public
 * @remarks
 * HTML Element: \<html-render\>
 */
export declare const fastToolingHTMLRender: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<{
        baseName: string;
        template: (
            context: import("@microsoft/fast-foundation").ElementDefinitionContext
        ) => import("@microsoft/fast-element").ViewTemplate<HTMLRender, any>;
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
        ) => import("@microsoft/fast-element").ViewTemplate<HTMLRender, any>;
        styles: (
            context: any,
            definition: any
        ) => import("@microsoft/fast-element").ElementStyles;
    },
    typeof HTMLRender
>;
