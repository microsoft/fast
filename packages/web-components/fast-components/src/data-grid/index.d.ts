import { DataGrid, DataGridCell, DataGridRow } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGridCell} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-data-grid-cell\>
 */
export declare const fastDataGridCell: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof DataGridCell
>;
/**
 * Styles for DataGrid cell
 * @public
 */
export declare const dataGridCellStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGridRow} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-data-grid-row\>
 */
export declare const fastDataGridRow: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof DataGridRow
>;
/**
 * Styles for DataGrid row
 * @public
 */
export declare const dataGridRowStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGrid} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-data-grid\>
 */
export declare const fastDataGrid: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof DataGrid
>;
/**
 * Styles for DataGrid
 * @public
 */
export declare const dataGridStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for DataGrid
 * @public
 */
export { DataGrid };
/**
 * Base class for DataGridRow
 * @public
 */
export { DataGridRow };
/**
 * Base class for DataGridCell
 * @public
 */
export { DataGridCell };
