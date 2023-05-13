import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context";
import { DataGridSelectionBehavior } from "./data-grid.options.js";

export interface DataGridContext {
    gridTemplateColumns: string;
    selectionBehavior: DataGridSelectionBehavior;
}

export const DataGridContext = Context.create<DataGridContext>("data-grid-context");

export class DefaultDataGridContext implements DataGridContext {
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
}
