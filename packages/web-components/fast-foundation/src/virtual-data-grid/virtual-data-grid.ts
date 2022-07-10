import {
    attr,
    FASTElement,
    nullableNumberConverter,
    observable,
    RepeatBehavior,
    RepeatDirective,
    Updates,
    ViewTemplate,
} from "@microsoft/fast-element";
import { FASTDataGrid, FASTDataGridRow } from "../data-grid/index.js";
import { Virtualizing } from "../virtual-list/index.js";

class _VirtualDataGrid extends FASTDataGrid {}
interface _VirtualDataGrid extends Virtualizing {}

/**
 * A virtualizing base class for the {@link @microsoft/fast-foundation#(FASTVirtualList:class)} component.
 *
 * @beta
 */
export class VirtualDataGrid extends Virtualizing(_VirtualDataGrid) {}

/**
 *  The VirtualDataGrid class
 *
 * @public
 */
export class FASTVirtualDataGrid extends VirtualDataGrid {
    protected rowsDataChanged(): void {
        this.sourceItems = this.rowsData;
        super.rowsDataChanged();
    }

    /**
     * @internal
     */
    protected initializeRepeatBehavior(): void {
        this.rowsPlaceholder = document.createComment("");
        this.appendChild(this.rowsPlaceholder);
        const rowsRepeatDirective = new RepeatDirective(
            x => x.renderItems,
            x => x.rowItemTemplate,
            { positioning: true }
        );
        this.rowsRepeatBehavior = rowsRepeatDirective.createBehavior({
            [rowsRepeatDirective.nodeId]: this.rowsPlaceholder,
        });

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.addBehaviors([this.rowsRepeatBehavior!]);
    }

    protected updateRowIndexes(): void {
        const newGridTemplateColumns: string = this.getGridTemplateColumns();

        this.rowElements.forEach((element: Element, index: number): void => {
            const thisRow = element as FASTDataGridRow;
            thisRow.rowIndex = index;
            thisRow.gridTemplateColumns = newGridTemplateColumns;
            if (this.columnDefinitionsStale) {
                thisRow.columnDefinitions = this.columnDefinitions;
            }
        });

        this.rowindexUpdateQueued = false;
        this.columnDefinitionsStale = false;
    }
}
