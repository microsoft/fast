import React from "react";
import { DataGridCellProps } from "./data-grid-cell.props";
import { DataGridProps, DataGridState } from "./data-grid";

export interface DataGridContextType {
    onCellFocused: (
        itemFocused: DataGridCellProps,
        event: React.FocusEvent<HTMLElement>
    ) => void;
    onCellKeyDown: (
        itemFocused: DataGridCellProps,
        event: React.KeyboardEvent<HTMLElement>
    ) => void;
    dataGridState: DataGridState;
    dataGridProps: DataGridProps;
}

export const DataGridContext: React.Context<DataGridContextType> = React.createContext<
    DataGridContextType
>({
    onCellFocused: null,
    onCellKeyDown: null,
    dataGridState: null,
    dataGridProps: null,
});
