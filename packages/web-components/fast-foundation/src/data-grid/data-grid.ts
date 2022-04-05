import type { SyntheticViewTemplate, ViewTemplate } from "@microsoft/fast-element";
import {
    attr,
    FASTElement,
    nullableNumberConverter,
    observable,
    oneWay,
    RepeatDirective,
    Updates,
} from "@microsoft/fast-element";
import { ViewBehaviorOrchestrator } from "@microsoft/fast-element/utilities";
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

import type { FASTDataGridCell } from "./data-grid-cell.js";
import type { FASTDataGridRow } from "./data-grid-row.js";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options.js";
export { DataGridRowTypes, GenerateHeaderOptions };

/**
 * Describes the how the dialog element handles selection
 *
 * @public
 */
export type DataGridSelectionMode = "none" | "single-row" | "multi-row";

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
    headerCellTemplate?: ViewTemplate | SyntheticViewTemplate;

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
    headerCellFocusTargetCallback?: (cell: FASTDataGridCell) => HTMLElement;

    /**
     * cell template
     */
    cellTemplate?: ViewTemplate | SyntheticViewTemplate;

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

    cellFocusTargetCallback?: (cell: FASTDataGridCell) => HTMLElement;

    /**
     * Whether this column is the row header
     */
    isRowHeader?: boolean;
}

/**
 * A Data Grid Custom HTML Element.
 *
 * @slot - The default slot for custom row elements
 * @public
 */
export class FASTDataGrid extends FASTElement {
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
     *  generates a gridTemplateColumns based on columndefinitions
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
     * When true the component will not add itself to the tab queue.
     * Default is false.
     *
     * @public
     * @remarks
     * HTML Attribute: no-tabbing
     */
    @attr({ attribute: "no-tabbing", mode: "boolean" })
    public noTabbing: boolean = false;
    protected noTabbingChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.noTabbing) {
                this.setAttribute("tabIndex", "-1");
            } else {
                this.setAttribute(
                    "tabIndex",
                    this.contains(document.activeElement) ||
                        this === document.activeElement
                        ? "-1"
                        : "0"
                );
            }
        }
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
    protected gridTemplateColumnsChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateRowIndexes();
        }
    }

    /**
     * The number of rows to move selection on page up/down keystrokes.
     * When undefined the grid will use viewport height/the height of the first non-header row.
     * If the grid itself is a scrolling container it will be considered the viewport for this purpose,
     * otherwise the document will be used.
     *
     * @public
     * @remarks
     * HTML Attribute: page-size
     */
    @attr({ attribute: "page-size", converter: nullableNumberConverter })
    public pageSize: number | undefined;

    /**
     * Defines how the grid handles row or cell selection.
     *
     * @public
     * @remarks
     * HTML Attribute: selection-mode
     */
    @attr({ attribute: "selection-mode" })
    public selectionMode: DataGridSelectionMode = "none";
    private selectionModeChanged(): void {
        if (this.$fastController.isConnected) {
            this.deselectAllRows();
        }
    }

    /**
     * Determines if clicks can automatically select
     *
     * @public
     * @remarks
     * HTML Attribute: click-select
     */
    @attr({ attribute: "click-select", mode: "boolean" })
    public clickSelect: boolean = true;

    /**
     * Determines if the header row is selectable
     *
     * @public
     * @remarks
     * HTML Attribute: select-row-header
     */
    @attr({ attribute: "select-row-header", mode: "boolean" })
    public selectableHeaderRow: boolean = false;

    /**
     * The initially selected grid elements.
     * In the case of row selection the format should be a comma delimited list of row indexes. ie. "1,3,5"
     *
     * @public
     * @remarks
     * HTML Attribute: initial-selection
     */
    @attr({ attribute: "initial-selection" })
    public initialSelection: string;

    /**
     * The data being displayed in the grid
     *
     * @public
     */
    @observable
    public rowsData: object[] = [];
    protected rowsDataChanged(): void {
        if (this.columnDefinitions === null && this.rowsData.length > 0) {
            this.columnDefinitions = FASTDataGrid.generateColumns(this.rowsData[0]);
        }
        if (this.$fastController.isConnected) {
            this.toggleGeneratedHeader();
            this.deselectAllRows();
        }
    }

    /**
     * The column definitions of the grid
     *
     * @public
     */
    @observable
    public columnDefinitions: ColumnDefinition[] | null = null;
    protected columnDefinitionsChanged(): void {
        if (!this.columnDefinitions) {
            return;
        }
        this.generatedGridTemplateColumns = FASTDataGrid.generateTemplateColumns(
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
     * @public
     */
    @observable
    public rowElements: HTMLElement[];

    /**
     * Selected row indexes
     *
     */
    private _selectedRowIndexes: number[] = [];

    /**
     * The selectedRowIndexes property.
     *
     * @public
     */
    public get selectedRowIndexes() {
        return this._selectedRowIndexes.slice();
    }

    public set selectedRowIndexes(next: number[]) {
        if (this.selectionMode !== "multi-row" && this.selectionMode !== "single-row") {
            return;
        }
        if (this.selectionMode === "single-row" && next.length > 1) {
            this._selectedRowIndexes.splice(0, this.selectedRowIndexes.length, next[0]);
        } else {
            this._selectedRowIndexes.splice(0, this.selectedRowIndexes.length, ...next);
        }
        this._selectedRowIndexes.splice(0, this.selectedRowIndexes.length, ...next);
        this.selectionUpdated = true;
        this.queueRowIndexUpdate();
    }

    /**
     * Selected range
     *
     * @internal
     */
    @observable
    public selectedRanges: DataGridSelectedRange[] = [];

    private rowsPlaceholder: Node | null = null;
    private behaviorOrchestrator: ViewBehaviorOrchestrator | null = null;

    private generatedHeader: FASTDataGridRow | null = null;

    // flag to indicate whether the grid is actively updating focus
    // (so we don't self-trigger changes)
    private isUpdatingFocus: boolean = false;

    private pendingFocusUpdate: boolean = false;

    private observer: MutationObserver;

    private rowindexUpdateQueued: boolean = false;
    private columnDefinitionsStale: boolean = true;

    private generatedGridTemplateColumns: string = "";

    private lastNotShiftSelectedRowIndex = -1;
    private lastShiftSelectedRowIndex = -1;

    private selectionUpdated: boolean = false;

    constructor() {
        super();
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.rowItemTemplate === undefined) {
            this.rowItemTemplate = this.defaultRowItemTemplate;
        }

        if (this.behaviorOrchestrator === null) {
            this.behaviorOrchestrator = ViewBehaviorOrchestrator.create(this);
            this.$fastController.addBehavior(this.behaviorOrchestrator);
            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<FASTDataGrid>(
                    oneWay(x => x.rowsData),
                    oneWay(x => x.rowItemTemplate),
                    { positioning: true }
                ),
                this.appendChild((this.rowsPlaceholder = document.createComment("")))
            );
        }

        this.toggleGeneratedHeader();
        this.addEventListener("row-focused", this.handleRowFocus);
        this.addEventListener(eventFocus, this.handleFocus);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.addEventListener(eventFocusOut, this.handleFocusOut);

        if (this.selectionMode === "single-row" || this.selectionMode === "multi-row") {
            this.addEventListener("rowselectionchanged", this.handleRowSelectedChange);
        }

        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this, { childList: true });

        if (this.noTabbing) {
            this.setAttribute("tabindex", "-1");
        }

        if (this.selectionMode !== "none" && this.initialSelection) {
            const selectionAsArray: string[] = this.initialSelection.split(",");
            const initialSelection: number[] = [];
            selectionAsArray.forEach((element: string): void => {
                initialSelection.push(parseInt(element.trim()));
            });

            this.selectedRowIndexes = initialSelection;
        }

        Updates.enqueue(this.queueRowIndexUpdate);
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

        if (this.selectionMode === "single-row" || this.selectionMode === "multi-row") {
            this.removeEventListener("rowselectionchanged", this.handleRowSelectedChange);
        }

        this.observer.disconnect();

        if (this.generatedHeader !== null) {
            this.removeChild(this.generatedHeader);
            this.generatedHeader = null;
        }
    }

    /**
     * @internal
     */
    public handleRowFocus(e: Event): void {
        this.isUpdatingFocus = true;
        const focusRow: FASTDataGridRow = e.target as FASTDataGridRow;
        this.focusRowIndex = this.rowElements.indexOf(focusRow);
        this.focusColumnIndex = focusRow.focusColumnIndex;
        this.setAttribute("tabIndex", "-1");
        this.isUpdatingFocus = false;
    }

    /**
     * @internal
     */
    public handleFocus(e: FocusEvent): void {
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, "nearest");
    }

    /**
     * @internal
     */
    public handleFocusOut(e: FocusEvent): void {
        if (e.relatedTarget === null || !this.contains(e.relatedTarget as Element)) {
            this.setAttribute("tabIndex", this.noTabbing ? "-1" : "0");
        }
    }

    /**
     * @internal
     */
    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }

        let newFocusRowIndex: number;

        switch (e.key) {
            case keyArrowUp:
                e.preventDefault();
                // focus up one row
                this.focusOnCell(
                    this.focusRowIndex - 1,
                    this.focusColumnIndex,
                    "nearest"
                );
                break;

            case keyArrowDown:
                e.preventDefault();
                // focus down one row
                this.focusOnCell(
                    this.focusRowIndex + 1,
                    this.focusColumnIndex,
                    "nearest"
                );
                break;

            case keyPageUp:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, "nearest");
                    break;
                }

                newFocusRowIndex = Math.max(0, this.focusRowIndex - this.getPageSize());

                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, "start");
                break;

            case keyPageDown:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, "nearest");
                    break;
                }
                newFocusRowIndex = Math.min(
                    this.rowElements.length - 1,
                    this.focusRowIndex + this.getPageSize()
                );
                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, "end");

                break;

            case keyHome:
                if (e.ctrlKey) {
                    e.preventDefault();
                    // focus first cell of first row
                    this.focusOnCell(0, 0, "nearest");
                }
                break;

            case keyEnd:
                if (e.ctrlKey && this.columnDefinitions !== null) {
                    e.preventDefault();
                    // focus last cell of last row
                    this.focusOnCell(
                        this.rowElements.length - 1,
                        this.columnDefinitions.length - 1,
                        "nearest"
                    );
                }
                break;

            case "a":
                if (!e.ctrlKey) {
                    return;
                }
                switch (this.selectionMode) {
                    case "multi-row":
                        this.selectAllRows();
                        e.preventDefault();
                        return;
                }
                break;
        }
    }

    public handleRowSelectedChange(e: CustomEvent): void {
        if (e.defaultPrevented || this.selectionMode === "none") {
            return;
        }

        const path: EventTarget[] = e.composedPath();
        const rowMatch: EventTarget | undefined = path.find((target: EventTarget) => {
            return this.rowElements.indexOf(target as HTMLElement) !== -1;
        });

        if (rowMatch) {
            e.preventDefault();
            const changedRow: DataGridRow = rowMatch as DataGridRow;
            const changeEventDetail: DataGridRowSelectionChangedDetail = e.detail;
            const newSelection: number[] = this.selectedRowIndexes;
            switch (this.selectionMode) {
                case "single-row":
                    this.handleSingleRowSelection(changedRow, changeEventDetail);
                    break;

                case "multi-row":
                    if (e.detail.shiftKey) {
                        if (this.lastNotShiftSelectedRowIndex === -1) {
                            this.handleSingleRowSelection(changedRow, changeEventDetail);
                        } else {
                            let i: number;
                            let dirMod: number;
                            if (this.lastShiftSelectedRowIndex !== -1) {
                                // undo the last thing
                                dirMod =
                                    this.lastShiftSelectedRowIndex >
                                    this.lastNotShiftSelectedRowIndex
                                        ? -1
                                        : 1;
                                i = this.lastShiftSelectedRowIndex;
                                for (
                                    i;
                                    i !== this.lastNotShiftSelectedRowIndex;
                                    i = i + dirMod
                                ) {
                                    newSelection.splice(newSelection.indexOf(i), 1);
                                }
                            }
                            dirMod =
                                changedRow.rowIndex > this.lastNotShiftSelectedRowIndex
                                    ? 1
                                    : -1;
                            i = this.lastNotShiftSelectedRowIndex + dirMod;
                            for (i; i !== changedRow.rowIndex + dirMod; i = i + dirMod) {
                                const selectedRowIndex: number = newSelection.indexOf(i);
                                if (
                                    !newSelection.includes(changedRow.rowIndex) &&
                                    selectedRowIndex === -1
                                ) {
                                    newSelection.push(i);
                                }
                                if (
                                    newSelection.includes(changedRow.rowIndex) &&
                                    selectedRowIndex !== -1
                                ) {
                                    newSelection.splice(selectedRowIndex, 1);
                                }
                            }

                            const changeRowIndexInSelectedIndexes = newSelection.indexOf(
                                changedRow.rowIndex
                            );
                            if (newSelection.includes(changedRow.rowIndex)) {
                                if (changeRowIndexInSelectedIndexes === -1) {
                                    newSelection.push(changedRow.rowIndex);
                                }
                            } else if (changeRowIndexInSelectedIndexes !== -1) {
                                newSelection.splice(changeRowIndexInSelectedIndexes, 1);
                            }
                        }
                        this.lastShiftSelectedRowIndex = changedRow.rowIndex;
                        this.selectedRowIndexes = newSelection;
                    } else if (e.detail.ctrlKey) {
                        if (
                            changeEventDetail.newValue &&
                            !newSelection.includes(changedRow.rowIndex)
                        ) {
                            newSelection.push(changedRow.rowIndex);
                            this.lastNotShiftSelectedRowIndex = changedRow.rowIndex;
                        }
                        if (
                            !changeEventDetail.newValue &&
                            newSelection.includes(changedRow.rowIndex)
                        ) {
                            newSelection.splice(
                                newSelection.indexOf(changedRow.rowIndex),
                                1
                            );
                            this.lastNotShiftSelectedRowIndex = -1;
                        }
                        this.lastShiftSelectedRowIndex = -1;
                        this.selectedRowIndexes = newSelection;
                    } else {
                        this.handleSingleRowSelection(changedRow, changeEventDetail);
                        this.lastShiftSelectedRowIndex = -1;
                    }
                    break;
            }
        }
    }

    private getPageSize(): number {
        if (this.pageSize) {
            return this.pageSize;
        }

        let rowHeight = 50;
        this.rowElements.forEach(element => {
            if (
                !element.hasAttribute("rowType") ||
                !element.getAttribute("rowType")?.includes("header")
            ) {
                rowHeight = element.clientHeight;
            }
        });

        let pageSize: number = 1;

        if (rowHeight === 0) {
            return pageSize;
        }

        if (this.clientHeight < this.scrollHeight) {
            pageSize = this.clientHeight / rowHeight;
        } else {
            pageSize = document.body.clientHeight / rowHeight;
        }

        pageSize = Math.max(Math.round(pageSize), 1);
        return pageSize;
    }

    private selectAllRows(): void {
        if (this.selectionMode !== "multi-row" || this.rowElements.length === 0) {
            return;
        }
        const hasHeaderRow =
            (this.rowElements[0] as DataGridRow).rowType === "header" ||
            (this.rowElements[0] as DataGridRow).rowType === "sticky-header";
        const selectableRowCount =
            this.rowElements.length +
            (hasHeaderRow && !this.selectableHeaderRow ? -1 : 0);
        if (this._selectedRowIndexes.length === selectableRowCount) {
            // deselect all if all are already selected
            this.selectedRowIndexes = [];
            return;
        }
        const newSelection: number[] = [];
        this.rowElements.forEach(element => {
            if (
                (element as DataGridRow).rowType === "header" ||
                (element as DataGridRow).rowType === "sticky-header"
            ) {
                if (this.selectableHeaderRow) {
                    newSelection.push((element as DataGridRow).rowIndex);
                }
            } else {
                newSelection.push((element as DataGridRow).rowIndex);
            }
        });
        this.lastNotShiftSelectedRowIndex = -1;
        this.selectedRowIndexes = newSelection;
    }

    private deselectAllRows(): void {
        this.selectedRowIndexes = [];
        this.lastNotShiftSelectedRowIndex = -1;
    }

    private handleSingleRowSelection(
        changedRow: DataGridRow,
        detail: DataGridRowSelectionChangedDetail
    ): void {
        if (detail.newValue) {
            this.selectedRowIndexes = [changedRow.rowIndex];
            this.lastNotShiftSelectedRowIndex = changedRow.rowIndex;
        } else {
            this.selectedRowIndexes = [];
            this.lastNotShiftSelectedRowIndex = -1;
        }
    }

    private focusOnCell = (
        rowIndex: number,
        columnIndex: number,
        alignment: ScrollLogicalPosition
    ): void => {
        if (this.rowElements.length === 0) {
            this.focusRowIndex = 0;
            this.focusColumnIndex = 0;
            return;
        }
        const focusRowIndex = Math.max(
            0,
            Math.min(this.rowElements.length - 1, rowIndex)
        );
        const focusRow: Element = this.rowElements[focusRowIndex];

        const cells: NodeListOf<Element> = focusRow.querySelectorAll(
            '[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'
        );

        const focusColumnIndex = Math.max(0, Math.min(cells.length - 1, columnIndex));

        const focusTarget: HTMLElement = cells[focusColumnIndex] as HTMLElement;
        if (focusTarget) {
            focusTarget.scrollIntoView({ block: alignment });
            focusTarget.focus();
        }
    };

    private queueFocusUpdate(): void {
        if (
            this.isUpdatingFocus &&
            (this.contains(document.activeElement) || this === document.activeElement)
        ) {
            return;
        }
        if (this.pendingFocusUpdate === false) {
            this.pendingFocusUpdate = true;
            Updates.enqueue(() => this.updateFocus());
        }
    }

    private updateFocus(): void {
        this.pendingFocusUpdate = false;
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, "nearest");
    }

    private toggleGeneratedHeader(): void {
        if (this.generatedHeader !== null) {
            this.removeChild(this.generatedHeader);
            this.generatedHeader = null;
        }

        if (
            this.generateHeader !== GenerateHeaderOptions.none &&
            this.columnDefinitions &&
            this.columnDefinitions.length
        ) {
            const generatedHeaderElement: HTMLElement = document.createElement(
                this.rowElementTag
            );
            this.generatedHeader = (generatedHeaderElement as unknown) as FASTDataGridRow;
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
        this.deselectAllRows();
        if (mutations && mutations.length) {
            mutations.forEach((mutation: MutationRecord): void => {
                mutation.addedNodes.forEach((newNode: Node): void => {
                    if (
                        newNode.nodeType === 1 &&
                        (newNode as Element).getAttribute("role") === "row"
                    ) {
                        (newNode as FASTDataGridRow).columnDefinitions = this.columnDefinitions;
                    }
                });
            });

            this.queueRowIndexUpdate();
        }
    };

    private queueRowIndexUpdate = (): void => {
        if (!this.rowindexUpdateQueued) {
            this.rowindexUpdateQueued = true;
            Updates.enqueue(this.updateRowIndexes);
        }
    };

    private updateRowIndexes = (): void => {
        let newGridTemplateColumns = this.gridTemplateColumns;

        if (newGridTemplateColumns === undefined) {
            // try to generate columns based on manual rows
            if (this.generatedGridTemplateColumns === "" && this.rowElements.length > 0) {
                const firstRow: FASTDataGridRow = this.rowElements[0] as FASTDataGridRow;
                this.generatedGridTemplateColumns = new Array(
                    firstRow.cellElements.length
                )
                    .fill("1fr")
                    .join(" ");
            }

            newGridTemplateColumns = this.generatedGridTemplateColumns;
        }

        this.rowElements.forEach((element: Element, index: number): void => {
            const thisRow = element as FASTDataGridRow;
            thisRow.rowIndex = index;
            thisRow.gridTemplateColumns = newGridTemplateColumns;
            thisRow.clickSelect = this.clickSelect;
            if (
                this.selectionMode === "single-row" ||
                this.selectionMode === "multi-row"
            ) {
                if (
                    (thisRow.rowType === "header" ||
                        thisRow.rowType === "sticky-header") &&
                    this.selectableHeaderRow
                ) {
                    thisRow.setAttribute(
                        "aria-selected",
                        this._selectedRowIndexes.includes(index) ? "true" : "false"
                    );
                } else {
                    thisRow.setAttribute(
                        "aria-selected",
                        this._selectedRowIndexes.includes(index) ? "true" : "false"
                    );
                }
            }
            if (this.columnDefinitionsStale) {
                thisRow.columnDefinitions = this.columnDefinitions;
            }
        });

        this.rowindexUpdateQueued = false;
        this.columnDefinitionsStale = false;
        if (this.selectionUpdated) {
            this.selectionUpdated = false;
            this.$emit("selectionchanged");
        }
    };
}
