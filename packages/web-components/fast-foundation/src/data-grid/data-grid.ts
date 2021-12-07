import {
    attr,
    DOM,
    observable,
    RepeatBehavior,
    ViewTemplate,
} from "@microsoft/fast-element";
import { eventScroll } from "@microsoft/fast-web-utilities";
import {
    eventFocus,
    eventFocusOut,
    eventKeyDown,
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyHome,
    keyPageDown,
    keyPageUp,
} from "@microsoft/fast-web-utilities";
import type { VirtualizingStack } from "../virtualizing-stack";
import { VirtualizingStackBase } from "../virtualizing-stack";
import type { DataGridCell } from "./data-grid-cell";
import type { DataGridRow } from "./data-grid-row";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options";

export { DataGridRowTypes, GenerateHeaderOptions };

/**
 * Defines a column in the grid
 *
 * @public
 */
export interface ColumnDefinition {
    /**
     * Identifies the data item to be displayed in this column
     * (i.e. how the data item is labelled in each row)
     */
    columnDataKey: string;

    /**
     * Sets the css grid-column property on the cell which controls its placement in
     * the parent row. If left unset the cells will set this value to match the index
     * of their column in the parent collection of ColumnDefinitions.
     */
    gridColumn?: string;

    /**
     *  Column title, if not provided columnDataKey is used as title
     */
    title?: string;

    /**
     *  Header cell template
     */
    headerCellTemplate?: ViewTemplate;

    /**
     * Whether the header cell has an internal focus queue
     */
    headerCellInternalFocusQueue?: boolean;

    /**
     * Callback function that returns the element to focus in a custom cell.
     * When headerCellInternalFocusQueue is false this function is called when the cell is first focused
     * to immediately move focus to a cell element, for example a cell that is a checkbox could move
     * focus directly to the checkbox.
     * When headerCellInternalFocusQueue is true this function is called when the user hits Enter or F2
     */
    headerCellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;

    /**
     * cell template
     */
    cellTemplate?: ViewTemplate;

    /**
     * Whether the cell has an internal focus queue
     */
    cellInternalFocusQueue?: boolean;

    /**
     * Callback function that returns the element to focus in a custom cell.
     * When cellInternalFocusQueue is false this function is called when the cell is first focused
     * to immediately move focus to a cell element, for example a cell that is a checkbox could move
     * focus directly to the checkbox.
     * When cellInternalFocusQueue is true this function is called when the user hits Enter or F2
     */

    cellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;

    /**
     * Whether this column is the row header
     */
    isRowHeader?: boolean;
}

/**
 * A Data Grid Custom HTML Element.
 *
 * @public
 */
export class DataGrid extends VirtualizingStackBase {
    /**
     *  generates a basic column definition by examining sample row data
     */
    public static generateColumns = (row: object): ColumnDefinition[] => {
        return Object.getOwnPropertyNames(row).map((property: string, index: number) => {
            return {
                columnDataKey: property,
                gridColumn: `${index}`,
            };
        });
    };

    /**
     *  generates a gridTemplateColumns based on columndata array
     */
    private static generateTemplateColumns(
        columnDefinitions: ColumnDefinition[]
    ): string {
        let templateColumns: string = "";
        columnDefinitions.forEach((column: ColumnDefinition) => {
            templateColumns = `${templateColumns}${
                templateColumns === "" ? "" : " "
            }${"1fr"}`;
        });
        return templateColumns;
    }

    /**
     *  Whether the grid should automatically generate a header row and its type
     *
     * @public
     * @remarks
     * HTML Attribute: generate-header
     */
    @attr({ attribute: "generate-header" })
    public generateHeader: GenerateHeaderOptions = GenerateHeaderOptions.default;
    private generateHeaderChanged(): void {
        if (this.$fastController.isConnected) {
            this.toggleGeneratedHeader();
        }
    }

    /**
     * String that gets applied to the the css gridTemplateColumns attribute of child rows
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    @attr({ attribute: "grid-template-columns" })
    public gridTemplateColumns: string;
    private gridTemplateColumnsChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateRowIndexes();
        }
    }

    /**
     * The data being displayed in the grid
     *
     * @public
     */
    @observable
    public rowsData: object[] = [];
    private rowsDataChanged(): void {
        if (this.columnDefinitions === null && this.rowsData.length > 0) {
            this.columnDefinitions = DataGrid.generateColumns(this.rowsData[0]);
        }

        if (this.$fastController.isConnected) {
            this.toggleGeneratedHeader();
        }
        this.items = this.rowsData;
    }

    /**
     * The column definitions of the grid
     *
     * @public
     */
    @observable
    public columnDefinitions: ColumnDefinition[] | null = null;
    private columnDefinitionsChanged(): void {
        if (this.columnDefinitions === null) {
            this.generatedGridTemplateColumns = "";
            return;
        }
        this.generatedGridTemplateColumns = DataGrid.generateTemplateColumns(
            this.columnDefinitions
        );
        if (this.$fastController.isConnected) {
            this.columnDefinitionsStale = true;
            this.queueRowIndexUpdate();
        }
    }

    /**
     * The template to use for the programmatic generation of rows
     *
     * @public
     */
    @observable
    public rowItemTemplate: ViewTemplate;
    private rowItemTemplateChanged(): void {
        this.itemTemplate = this.rowItemTemplate;
    }

    /**
     * The template used to render cells in generated rows.
     *
     * @public
     */
    @observable
    public cellItemTemplate?: ViewTemplate;

    /**
     * The template used to render header cells in generated rows.
     *
     * @public
     */
    @observable
    public headerCellItemTemplate?: ViewTemplate;
    private headerCellItemTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.generatedHeader !== null) {
                this.generatedHeader.headerCellItemTemplate = this.headerCellItemTemplate;
            }
        }
    }

    /**
     * The index of the row that will receive focus the next time the
     * grid is focused. This value changes as focus moves to different
     * rows within the grid.  Changing this value when focus is already
     * within the grid moves focus to the specified row.
     *
     * @public
     */
    @observable
    public focusRowIndex: number = 0;
    private focusRowIndexChanged(): void {
        if (this.$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }

    /**
     * The index of the column that will receive focus the next time the
     * grid is focused. This value changes as focus moves to different rows
     * within the grid.  Changing this value when focus is already within
     * the grid moves focus to the specified column.
     *
     * @public
     */
    @observable
    public focusColumnIndex: number = 0;
    private focusColumnIndexChanged(): void {
        if (this.$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public authoredRowCount: number = 0;

    /**
     * The default row item template.  Set by the component templates.
     *
     * @internal
     */
    @observable
    public defaultRowItemTemplate: ViewTemplate;

    /**
     * Set by the component templates.
     *
     */
    @observable
    public rowElementTag: string;

    /**
     * Children that are rows
     *
     * @internal
     */
    @observable
    public rowElements: HTMLElement[];

    /**
     *
     *
     * @internal
     */
    public stack: VirtualizingStack;

    private rowsRepeatBehavior: RepeatBehavior | null;
    private rowsPlaceholder: Node | null = null;

    private generatedHeader: DataGridRow | null = null;

    private isUpdatingFocus: boolean = false;
    private pendingFocusUpdate: boolean = false;
    private setFocusOnItemsChanged: boolean = false;

    private observer: MutationObserver;

    private rowindexUpdateQueued: boolean = false;
    private columnDefinitionsStale: boolean = true;

    private generatedGridTemplateColumns: string = "";

    constructor() {
        super();
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        this.autoUpdateMode = "viewport-resize";
        super.connectedCallback();

        if (this.rowItemTemplate === undefined) {
            this.rowItemTemplate = this.defaultRowItemTemplate;
        }

        this.toggleGeneratedHeader();

        // if (!this.virtualize) {
        //     this.rowsPlaceholder = document.createComment("");
        //     this.appendChild(this.rowsPlaceholder);

        //     this.rowsRepeatBehavior = new RepeatDirective(
        //         x => x.rowsData,
        //         x => x.rowItemTemplate,
        //         { positioning: true }
        //     ).createBehavior(this.rowsPlaceholder);
        // /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        //this.$fastController.addBehaviors([this.rowsRepeatBehavior!]);
        // }

        this.addEventListener("row-focused", this.handleRowFocus);
        this.addEventListener(eventFocus, this.handleFocus);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.addEventListener(eventFocusOut, this.handleFocusOut);
        this.addEventListener(eventScroll, this.handleScroll, {
            passive: true,
            capture: true,
        });

        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this, { childList: true });

        DOM.queueUpdate(() => this.queueRowIndexUpdate());
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("row-focused", this.handleRowFocus);
        this.removeEventListener(eventFocus, this.handleFocus);
        this.removeEventListener(eventKeyDown, this.handleKeydown);
        this.removeEventListener(eventFocusOut, this.handleFocusOut);
        this.removeEventListener(eventScroll, this.handleScroll);

        // disconnect observer
        this.observer.disconnect();

        this.rowsPlaceholder = null;
        this.generatedHeader = null;
    }

    /**
     * @internal
     */
    public handleRowFocus(e: Event): void {
        this.isUpdatingFocus = true;
        const focusRow: DataGridRow = e.target as DataGridRow;
        this.focusRowIndex = focusRow.rowIndex;
        this.focusColumnIndex = focusRow.focusColumnIndex;
        this.removeAttribute("tabIndex");
        this.isUpdatingFocus = false;
        console.debug(`focusrow: ${this.focusRowIndex}`);
    }

    public focus(): void {
        this.moveGridFocusToCell();
    }

    /**
     * @internal
     */
    public handleFocus(e: FocusEvent): void {
        if (!this.setFocusOnItemsChanged && e.target === this) {
            this.moveGridFocusToCell();
        }
    }

    private moveGridFocusToCell(): void {
        if (
            !this.isRowindexVirtualized(this.focusRowIndex) &&
            this.isRowInView(this.getRowElement(this.focusRowIndex) as DataGridRow)
        ) {
            const focusRowElement: DataGridRow | null = this.getRowElement(
                this.focusRowIndex
            );
            if (focusRowElement !== null && this.isRowInView(focusRowElement)) {
                this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, false);
                return;
            }
        }

        console.debug("handleFocus");

        // focus row is out of view, pick row at top of visual display
        const newFocusRowIndex: number = this.getFirstRowIndexInView();
        if (newFocusRowIndex > -1) {
            this.focusOnCell(this.getFirstRowIndexInView(), this.focusColumnIndex, false);
        }
    }

    private getFirstRowIndexInView(): number {
        for (let i: number = 0; i < this.rowElements.length; i++) {
            const thisRow: HTMLElement = this.rowElements[i];
            if (thisRow !== null && thisRow.offsetTop >= this.scrollTop) {
                return (this.rowElements[i] as DataGridRow).rowIndex;
            }
        }
        return -1;
    }

    private isRowInView(rowElement: DataGridRow): boolean {
        if (
            rowElement !== null &&
            rowElement.offsetTop + rowElement.offsetHeight > this.scrollTop &&
            rowElement.offsetTop < this.scrollTop + this.clientHeight
        ) {
            return true;
        }

        return false;
    }

    /**
     * @internal
     */
    public handleFocusOut(e: FocusEvent): void {
        if (e.relatedTarget === null || !this.contains(e.relatedTarget as Element)) {
            this.setAttribute("tabIndex", "0");
        }
    }

    /**
     * @internal
     */
    public handleScroll(e: Event): void {
        this.requestPositionUpdates();
    }

    /**
     * @internal
     */
    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }

        let newFocusRowIndex: number = this.focusRowIndex;

        const focusRowElement: DataGridRow | null = this.getRowElement(newFocusRowIndex);
        if (focusRowElement === null || !this.isRowInView(focusRowElement)) {
            newFocusRowIndex = this.getFirstRowIndexInView();
        }

        if (newFocusRowIndex === -1) {
            return;
        }

        const maxIndex = this.rowsData.length + this.authoredRowCount - 1;
        const currentGridBottom: number = this.scrollTop + this.clientHeight;
        // const lastRow: HTMLElement = this.rowElements[maxIndex] as HTMLElement;

        let thisRowBottom: number = this.itemSpan;

        switch (e.key) {
            case keyArrowUp:
                e.preventDefault();
                // focus up one row
                this.focusOnCell(newFocusRowIndex - 1, this.focusColumnIndex, false);
                return;

            case keyArrowDown:
                e.preventDefault();
                // focus down one row
                this.focusOnCell(newFocusRowIndex + 1, this.focusColumnIndex, false);
                return;

            case keyPageUp:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, true);
                    return;
                }

                // focus up one "page"
                newFocusRowIndex = newFocusRowIndex - 1;
                if (newFocusRowIndex <= 0) {
                    this.focusOnCell(0, this.focusColumnIndex, true);
                    return;
                }

                for (newFocusRowIndex; newFocusRowIndex >= 0; newFocusRowIndex--) {
                    if (
                        newFocusRowIndex < this.authoredRowCount &&
                        this.rowElements[newFocusRowIndex].offsetTop <=
                            this.scrollTop - this.clientHeight
                    ) {
                        this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, true);
                        return;
                    }

                    if (
                        this.getGeneratedItemPosition(
                            newFocusRowIndex - this.authoredRowCount
                        ) <=
                        this.scrollTop - this.clientHeight
                    ) {
                        this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, true);
                        return;
                    }
                }

                break;

            case keyPageDown:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, false);
                    return;
                }

                newFocusRowIndex = newFocusRowIndex + 1;

                // focus down one "page"
                if (
                    newFocusRowIndex >= maxIndex ||
                    this.containerElement.clientHeight <= currentGridBottom
                ) {
                    this.focusOnCell(maxIndex, this.focusColumnIndex, true);
                    return;
                }

                for (newFocusRowIndex; newFocusRowIndex <= maxIndex; newFocusRowIndex++) {
                    thisRowBottom =
                        this.getGeneratedItemPosition(
                            newFocusRowIndex - this.authoredRowCount
                        ) + this.itemSpan;
                    if (thisRowBottom > currentGridBottom) {
                        this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, true);
                        return;
                    }
                }

                // for (newFocusRowIndex; newFocusRowIndex <= maxIndex; newFocusRowIndex++) {
                //     const thisRow: HTMLElement = this.rowElements[
                //         newFocusRowIndex
                //     ] as HTMLElement;
                //     if (thisRow.offsetTop + thisRow.offsetHeight > currentGridBottom) {
                //         let stickyHeaderOffset: number = 0;
                //         if (
                //             this.generateHeader === GenerateHeaderOptions.sticky &&
                //             this.generatedHeader !== null
                //         ) {
                //             stickyHeaderOffset = this.generatedHeader.clientHeight;
                //         }
                //         this.scrollTop = thisRow.offsetTop - stickyHeaderOffset;
                //         break;
                //     }
                // }

                break;

            case keyHome:
                if (e.ctrlKey) {
                    e.preventDefault();
                    // focus first cell of first row
                    this.focusOnCell(0, 0, false);
                }
                break;

            case keyEnd:
                if (e.ctrlKey && this.columnDefinitions !== null) {
                    e.preventDefault();
                    // focus last cell of last row
                    this.focusOnCell(
                        this.authoredRowCount + this.rowsData.length - 1,
                        this.columnDefinitions.length - 1,
                        false
                    );
                }
                break;
        }
    }

    private isRowindexVirtualized(rowIndex: number): boolean {
        if (
            !this.virtualize ||
            rowIndex < this.authoredRowCount ||
            (rowIndex >= this.firstRenderedIndex + this.authoredRowCount &&
                rowIndex <= this.lastRenderedIndex + this.authoredRowCount)
        ) {
            return false;
        }

        return true;
    }

    private getRowElement(rowIndex: number): DataGridRow | null {
        if (rowIndex < this.authoredRowCount || !this.virtualize) {
            return this.rowElements[rowIndex] as DataGridRow;
        } else if (
            rowIndex >= this.firstRenderedIndex + this.authoredRowCount &&
            rowIndex <= this.lastRenderedIndex + this.authoredRowCount
        ) {
            return this.rowElements[rowIndex - this.firstRenderedIndex] as DataGridRow;
        }

        return null;
    }

    private focusOnCell = (
        rowIndex: number,
        columnIndex: number,
        forceScrollToTop: boolean
    ): void => {
        if (this.rowElements.length === 0) {
            return;
        }

        console.debug("focusoncell");

        // constrain to number of total rows
        const maxRowIndex = this.rowsData.length + this.authoredRowCount - 1;
        if (rowIndex < 0) {
            rowIndex = 0;
        } else if (rowIndex >= maxRowIndex) {
            rowIndex = maxRowIndex;
        }

        let focusRowElement: DataGridRow | null = this.getRowElement(rowIndex);

        if (focusRowElement !== null && focusRowElement !== undefined) {
            const cells: NodeListOf<Element> = focusRowElement.querySelectorAll(
                '[role="cell"], [role="gridcell"], [role="columnheader"]'
            );

            const focusColumnIndex = Math.max(0, Math.min(cells.length - 1, columnIndex));

            const focusTarget: HTMLElement = cells[focusColumnIndex] as HTMLElement;

            if (forceScrollToTop) {
                this.scrollTop = focusTarget.offsetTop;
            }
            // else if (
            //     !this.isRowInView(focusRowElement)
            // ) {
            //     focusTarget.scrollIntoView({ block: "center", inline: "center" });
            // }

            if (document.activeElement !== focusTarget) {
                focusTarget.focus();
            }

            return;
        }

        // the focus row is virtualized
        // scroll to it and queue a focus update
        const focusRowPosition: number = this.getGeneratedItemPosition(
            rowIndex - this.authoredRowCount
        );
        this.scrollTop = focusRowPosition;
        this.setFocusOnItemsChanged = true;
        this.isUpdatingFocus = true;
        this.focusRowIndex = rowIndex;
        this.isUpdatingFocus = false;
        console.debug(`queue virtual focus - focusrow: ${rowIndex}`);
    };

    private queueFocusUpdate(): void {
        if (this.isUpdatingFocus) {
            return;
        }
        if (this.pendingFocusUpdate === false) {
            this.pendingFocusUpdate = true;
            DOM.queueUpdate(() => this.updateFocus());
        }
    }

    private updateFocus(): void {
        this.pendingFocusUpdate = false;
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, false);
    }

    private toggleGeneratedHeader(): void {
        if (this.generatedHeader !== null) {
            this.removeChild(this.generatedHeader);
            this.generatedHeader = null;
        }

        if (
            this.generateHeader !== GenerateHeaderOptions.none &&
            this.rowsData.length > 0
        ) {
            const generatedHeaderElement: HTMLElement = document.createElement(
                this.rowElementTag
            );
            this.generatedHeader = (generatedHeaderElement as unknown) as DataGridRow;
            this.generatedHeader.columnDefinitions = this.columnDefinitions;
            this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns;
            this.generatedHeader.rowType =
                this.generateHeader === GenerateHeaderOptions.sticky
                    ? DataGridRowTypes.stickyHeader
                    : DataGridRowTypes.header;
            if (this.firstChild !== null || this.rowsPlaceholder !== null) {
                this.insertBefore(
                    generatedHeaderElement,
                    this.firstChild !== null ? this.firstChild : this.rowsPlaceholder
                );
            }
            return;
        }
    }

    private onChildListChange = (
        mutations: MutationRecord[],
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        observer: MutationObserver
    ): void => {
        if (mutations && mutations.length) {
            mutations.forEach((mutation: MutationRecord): void => {
                mutation.addedNodes.forEach((newNode: Node): void => {
                    if (
                        newNode.nodeType === 1 &&
                        (newNode as Element).getAttribute("role") === "row"
                    ) {
                        (newNode as DataGridRow).columnDefinitions = this.columnDefinitions;
                    }
                });
            });

            this.queueRowIndexUpdate();
        }
    };

    private queueRowIndexUpdate = (): void => {
        if (!this.rowindexUpdateQueued) {
            this.rowindexUpdateQueued = true;
            DOM.queueUpdate(() => this.updateRowIndexes());
        }
    };

    private updateRowIndexes = (): void => {
        let newGridTemplateColumns = this.gridTemplateColumns;

        if (newGridTemplateColumns === undefined) {
            // try to generate columns based on manual rows
            if (this.generatedGridTemplateColumns === "" && this.rowElements.length > 0) {
                const firstRow: DataGridRow = this.rowElements[0] as DataGridRow;
                this.generatedGridTemplateColumns = new Array(
                    firstRow.cellElements.length
                )
                    .fill("1fr")
                    .join(" ");
            }

            newGridTemplateColumns = this.generatedGridTemplateColumns;
        }

        const rowCount: number = this.rowElements.length;
        let newAuthoredRowCount: number = 0;
        for (let i: number = 0; i < rowCount; i++) {
            const thisRow = this.rowElements[i] as DataGridRow;
            if (thisRow.getAttribute("slot") === "generated-rows") {
                break;
            }
            newAuthoredRowCount = i + 1;
            thisRow.rowIndex = i;
            thisRow.gridTemplateColumns = newGridTemplateColumns;
            if (this.columnDefinitionsStale) {
                thisRow.columnDefinitions = this.columnDefinitions;
            }
        }

        this.authoredRowCount = newAuthoredRowCount;

        this.rowindexUpdateQueued = false;
        this.columnDefinitionsStale = false;

        if (
            this.setFocusOnItemsChanged &&
            !this.isRowindexVirtualized(this.focusRowIndex)
        ) {
            this.setFocusOnItemsChanged = false;
            this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, false);
        }
    };
}
