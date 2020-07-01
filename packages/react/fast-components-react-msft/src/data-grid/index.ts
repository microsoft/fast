import React from "react";
import {
    DataGrid as BaseDataGrid,
    DataGridHandledProps as BaseDataGridHandledProps,
    DataGridProps as BaseDataGridProps,
    DataGridCellProps,
    DataGridCellRenderConfig,
    DataGridClassNameContract,
    DataGridColumn,
    DataGridManagedClasses,
    DataGridRowHeightCallbackParams,
    DataGridUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DataGridStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import dataGridSchema from "./data-grid.schema";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const DataGrid = manageJss(DataGridStyles)(BaseDataGrid);
type DataGrid = InstanceType<typeof DataGrid>;

type DataGridHandledProps = Subtract<BaseDataGridHandledProps, DataGridManagedClasses>;
type DataGridProps = ManagedJSSProps<
    BaseDataGridProps,
    DataGridClassNameContract,
    DesignSystem
>;

export {
    DataGrid,
    DataGridCellProps,
    DataGridCellRenderConfig,
    DataGridClassNameContract,
    DataGridColumn,
    DataGridHandledProps,
    DataGridUnhandledProps,
    DataGridProps,
    DataGridRowHeightCallbackParams,
    dataGridSchema,
};
