import React, { ReactText } from "react";
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
    focusRowKey: ReactText | null;
    focusCellKey: ReactText | null;
    desiredVisibleRowIndex: number | null;
    desiredFocusRowKey: ReactText | null;
    desiredFocusColumnKey: ReactText | null;
    dataGridProps: DataGridProps;
}

export const DataGridContext: React.Context<DataGridContextType> = React.createContext<
    DataGridContextType
>({
    onCellFocused: null,
    onCellKeyDown: null,
    focusRowKey: null,
    focusCellKey: null,
    desiredVisibleRowIndex: null,
    desiredFocusRowKey: null,
    desiredFocusColumnKey: null,
    dataGridProps: null,
});
