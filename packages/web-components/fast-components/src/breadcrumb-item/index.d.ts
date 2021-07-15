import { BreadcrumbItem, BreadcrumbItemOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#BreadcrumbItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#breadcrumbItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-breadcrumb-item\>
 */
export declare const fastBreadcrumbItem: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        BreadcrumbItemOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    BreadcrumbItemOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Base class for BreadcrumbItem
 * @public
 */
export { BreadcrumbItem };
