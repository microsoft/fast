import React, { ReactText } from "react";
import { DataGridCellProps } from "./data-grid-cell.props";
import { DataGridColumn } from "./data-grid.props";

export interface DataGridContextType {
    onCellFocused: (
        itemFocused: DataGridCellProps,
        event: React.FocusEvent<HTMLElement>
    ) => void;
    onCellKeyDown: (
        itemFocused: DataGridCellProps,
        event: React.KeyboardEvent<HTMLElement>
    ) => void;
    focusRowKey: ReactText | null;
    focusColumnKey: ReactText | null;
    desiredVisibleRowIndex: number | null;
    desiredFocusRowKey: ReactText | null;
    desiredFocusColumnKey: ReactText | null;
    columns: DataGridColumn[] | null;
    dataRowKey: ReactText | null;
}

export const DataGridContext: React.Context<DataGridContextType> = React.createContext<
    DataGridContextType
>({
    onCellFocused: null,
    onCellKeyDown: null,
    focusRowKey: null,
    focusColumnKey: null,
    desiredVisibleRowIndex: null,
    desiredFocusRowKey: null,
    desiredFocusColumnKey: null,
    columns: null,
    dataRowKey: null,
});
