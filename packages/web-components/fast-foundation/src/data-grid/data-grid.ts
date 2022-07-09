import type { SyntheticViewTemplate, ViewTemplate } from "@microsoft/fast-element";
import {
    attr,
    bind,
    FASTElement,
    observable,
    RepeatDirective,
    Updates,
    ViewBehaviorOrchestrator,
} from "@microsoft/fast-element";
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
    headerCellTemplate?: ViewTemplate | SyntheticViewTemplate | string;

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
    cellTemplate?: ViewTemplate | SyntheticViewTemplate | string;

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
        if (this.columnDefinitions === null) {
            this.generatedGridTemplateColumns = "";
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
     * @internal
     */
    @observable
    public rowElements: HTMLElement[];

    private rowsPlaceholder: Node | null = null;
    private behaviorOrchestrator: ViewBehaviorOrchestrator | null = null;

    private generatedHeader: FASTDataGridRow | null = null;

    private isUpdatingFocus: boolean = false;
    private pendingFocusUpdate: boolean = false;

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
        super.connectedCallback();

        if (this.rowItemTemplate === undefined) {
            this.rowItemTemplate = this.defaultRowItemTemplate;
        }

        this.rowsPlaceholder = document.createComment("");
        this.appendChild(this.rowsPlaceholder);

        if (this.behaviorOrchestrator === null) {
            this.behaviorOrchestrator = ViewBehaviorOrchestrator.create(this);
            this.$fastController.addBehavior(this.behaviorOrchestrator);
            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<FASTDataGrid>(
                    bind(x => x.rowsData, false),
                    bind(x => x.rowItemTemplate, false),
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

        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this, { childList: true });

        if (this.noTabbing) {
            this.setAttribute("tabindex", "-1");
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
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
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
        const maxIndex = this.rowElements.length - 1;
        const currentGridBottom: number = this.offsetHeight + this.scrollTop;
        const lastRow: HTMLElement = this.rowElements[maxIndex] as HTMLElement;

        switch (e.key) {
            case keyArrowUp:
                e.preventDefault();
                // focus up one row
                this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, true);
                break;

            case keyArrowDown:
                e.preventDefault();
                // focus down one row
                this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, true);
                break;

            case keyPageUp:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, false);
                    break;
                }
                if (this.focusRowIndex === 0) {
                    this.focusOnCell(0, this.focusColumnIndex, false);
                    return;
                }

                newFocusRowIndex = this.focusRowIndex - 1;

                for (newFocusRowIndex; newFocusRowIndex >= 0; newFocusRowIndex--) {
                    const thisRow: HTMLElement = this.rowElements[newFocusRowIndex];
                    if (thisRow.offsetTop < this.scrollTop) {
                        this.scrollTop =
                            thisRow.offsetTop + thisRow.clientHeight - this.clientHeight;
                        break;
                    }
                }

                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);
                break;

            case keyPageDown:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, false);
                    break;
                }

                // focus down one "page"
                if (
                    this.focusRowIndex >= maxIndex ||
                    lastRow.offsetTop + lastRow.offsetHeight <= currentGridBottom
                ) {
                    this.focusOnCell(maxIndex, this.focusColumnIndex, false);
                    return;
                }

                newFocusRowIndex = this.focusRowIndex + 1;

                for (newFocusRowIndex; newFocusRowIndex <= maxIndex; newFocusRowIndex++) {
                    const thisRow: HTMLElement = this.rowElements[
                        newFocusRowIndex
                    ] as HTMLElement;
                    if (thisRow.offsetTop + thisRow.offsetHeight > currentGridBottom) {
                        let stickyHeaderOffset: number = 0;
                        if (
                            this.generateHeader === GenerateHeaderOptions.sticky &&
                            this.generatedHeader !== null
                        ) {
                            stickyHeaderOffset = this.generatedHeader.clientHeight;
                        }
                        this.scrollTop = thisRow.offsetTop - stickyHeaderOffset;
                        break;
                    }
                }

                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);

                break;

            case keyHome:
                if (e.ctrlKey) {
                    e.preventDefault();
                    // focus first cell of first row
                    this.focusOnCell(0, 0, true);
                }
                break;

            case keyEnd:
                if (e.ctrlKey && this.columnDefinitions !== null) {
                    e.preventDefault();
                    // focus last cell of last row
                    this.focusOnCell(
                        this.rowElements.length - 1,
                        this.columnDefinitions.length - 1,
                        true
                    );
                }
                break;
        }
    }

    private focusOnCell = (
        rowIndex: number,
        columnIndex: number,
        scrollIntoView: boolean
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

        if (
            scrollIntoView &&
            this.scrollHeight !== this.clientHeight &&
            ((focusRowIndex < this.focusRowIndex && this.scrollTop > 0) ||
                (focusRowIndex > this.focusRowIndex &&
                    this.scrollTop < this.scrollHeight - this.clientHeight))
        ) {
            focusTarget.scrollIntoView({ block: "center", inline: "center" });
        }

        focusTarget.focus();
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
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
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
            if (this.columnDefinitionsStale) {
                thisRow.columnDefinitions = this.columnDefinitions;
            }
        });

        this.rowindexUpdateQueued = false;
        this.columnDefinitionsStale = false;
    };
}
