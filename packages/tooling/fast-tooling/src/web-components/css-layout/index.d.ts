import { CSSLayout } from "./css-layout";
/**
 * The FAST Tooling CSS layout Element.
 *
 * @public
 * @remarks
 * HTML Element: \<css-layout\>
 */
export declare const fastToolingCSSLayout: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<{
        baseName: string;
        template: (
            context: import("@microsoft/fast-foundation").ElementDefinitionContext
        ) => import("@microsoft/fast-element").ViewTemplate<CSSLayout, any>;
        styles: import("@microsoft/fast-element").ElementStyles;
    }>
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    {
        baseName: string;
        template: (
            context: import("@microsoft/fast-foundation").ElementDefinitionContext
        ) => import("@microsoft/fast-element").ViewTemplate<CSSLayout, any>;
        styles: import("@microsoft/fast-element").ElementStyles;
    },
    typeof CSSLayout
>;
export { cssLayoutCssProperties } from "./css-layout.css-properties";
