import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context";
import { ColumnDefinition, DataGridSelectionBehavior } from "./data-grid.options.js";

export interface DataGridContext {
    columnDefinitions: ColumnDefinition[] | [];
    gridTemplateColumns: string;
    rowsData: object[];
    selectionBehavior: DataGridSelectionBehavior;
}

export const DataGridContext = Context.create<DataGridContext>("data-grid-context");

export class DefaultDataGridContext implements DataGridContext {
    /**
     * The data being displayed in the grid
     *
     * @internal
     */
    @observable
    public rowsData: object[] = [];

    /**
     * The disabled state of the picker
     *
     * @internal
     */
    @observable
    public gridTemplateColumns: string;

    /**
     * Selection behavior
     *
     * @internal
     */
    @observable
    public selectionBehavior: DataGridSelectionBehavior = DataGridSelectionBehavior.auto;

    /**
     * The column definitions of the grid
     *
     * @internal
     */
    @observable
    public columnDefinitions: ColumnDefinition[] = [];
}
