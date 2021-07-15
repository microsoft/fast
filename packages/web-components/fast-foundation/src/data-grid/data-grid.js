var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, DOM, observable, RepeatDirective } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import {
    eventFocus,
    eventFocusOut,
    eventKeyDown,
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    keyCodePageDown,
    keyCodePageUp,
} from "@microsoft/fast-web-utilities";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options";
export { DataGridRowTypes, GenerateHeaderOptions };
/**
 * A Data Grid Custom HTML Element.
 *
 * @public
 */
export class DataGrid extends FoundationElement {
    constructor() {
        super();
        /**
         *  Whether the grid should automatically generate a header row and its type
         *
         * @public
         * @remarks
         * HTML Attribute: generate-header
         */
        this.generateHeader = GenerateHeaderOptions.default;
        /**
         * The data being displayed in the grid
         *
         * @public
         */
        this.rowsData = [];
        /**
         * The column definitions of the grid
         *
         * @public
         */
        this.columnDefinitions = null;
        /**
         * The index of the row that will receive focus the next time the
         * grid is focused. This value changes as focus moves to different
         * rows within the grid.  Changing this value when focus is already
         * within the grid moves focus to the specified row.
         *
         * @public
         */
        this.focusRowIndex = 0;
        /**
         * The index of the column that will receive focus the next time the
         * grid is focused. This value changes as focus moves to different rows
         * within the grid.  Changing this value when focus is already within
         * the grid moves focus to the specified column.
         *
         * @public
         */
        this.focusColumnIndex = 0;
        this.rowsPlaceholder = null;
        this.generatedHeader = null;
        this.isUpdatingFocus = false;
        this.pendingFocusUpdate = false;
        this.rowindexUpdateQueued = false;
        this.columnDefinitionsStale = true;
        this.generatedGridTemplateColumns = "";
        this.focusOnCell = (rowIndex, columnIndex, scrollIntoView) => {
            if (this.rowElements.length === 0) {
                this.focusRowIndex = 0;
                this.focusColumnIndex = 0;
                return;
            }
            const focusRowIndex = Math.max(
                0,
                Math.min(this.rowElements.length - 1, rowIndex)
            );
            const focusRow = this.rowElements[focusRowIndex];
            const cells = focusRow.querySelectorAll(
                '[role="cell"], [role="gridcell"], [role="columnheader"]'
            );
            const focusColumnIndex = Math.max(0, Math.min(cells.length - 1, columnIndex));
            const focusTarget = cells[focusColumnIndex];
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
        this.onChildListChange = (
            mutations,
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            observer
        ) => {
            if (mutations.length) {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(newNode => {
                        if (
                            newNode.nodeType === 1 &&
                            newNode.getAttribute("role") === "row"
                        ) {
                            newNode.columnDefinitions = this.columnDefinitions;
                        }
                    });
                });
                this.queueRowIndexUpdate();
            }
        };
        this.queueRowIndexUpdate = () => {
            if (!this.rowindexUpdateQueued) {
                this.rowindexUpdateQueued = true;
                DOM.queueUpdate(this.updateRowIndexes);
            }
        };
        this.updateRowIndexes = () => {
            const newGridTemplateColumns =
                this.gridTemplateColumns === undefined
                    ? this.generatedGridTemplateColumns
                    : this.gridTemplateColumns;
            this.rowElements.forEach((element, index) => {
                const thisRow = element;
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
    /**
     *  generates a gridTemplateColumns based on columndata array
     */
    static generateTemplateColumns(columnDefinitions) {
        let templateColumns = "";
        columnDefinitions.forEach(column => {
            templateColumns = `${templateColumns}${
                templateColumns === "" ? "" : " "
            }${"1fr"}`;
        });
        return templateColumns;
    }
    generateHeaderChanged() {
        if (this.$fastController.isConnected) {
            this.toggleGeneratedHeader();
        }
    }
    gridTemplateColumnsChanged() {
        if (this.$fastController.isConnected) {
            this.updateRowIndexes();
        }
    }
    rowsDataChanged() {
        if (this.columnDefinitions === null && this.rowsData.length > 0) {
            this.columnDefinitions = DataGrid.generateColumns(this.rowsData[0]);
        }
    }
    columnDefinitionsChanged() {
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
    headerCellItemTemplateChanged() {
        if (this.$fastController.isConnected) {
            if (this.generatedHeader !== null) {
                this.generatedHeader.headerCellItemTemplate = this.headerCellItemTemplate;
            }
        }
    }
    focusRowIndexChanged() {
        if (this.$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }
    focusColumnIndexChanged() {
        if (this.$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.rowItemTemplate === undefined) {
            this.rowItemTemplate = this.defaultRowItemTemplate;
        }
        this.rowsPlaceholder = document.createComment("");
        this.appendChild(this.rowsPlaceholder);
        this.toggleGeneratedHeader();
        this.rowsRepeatBehavior = new RepeatDirective(
            x => x.rowsData,
            x => x.rowItemTemplate,
            { positioning: true }
        ).createBehavior(this.rowsPlaceholder);
        this.$fastController.addBehaviors([this.rowsRepeatBehavior]);
        this.addEventListener("row-focused", this.handleRowFocus);
        this.addEventListener(eventFocus, this.handleFocus);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.addEventListener(eventFocusOut, this.handleFocusOut);
        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this, { childList: true });
        DOM.queueUpdate(this.queueRowIndexUpdate);
    }
    /**
     * @internal
     */
    disconnectedCallback() {
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
    handleRowFocus(e) {
        this.isUpdatingFocus = true;
        const focusRow = e.target;
        this.focusRowIndex = this.rowElements.indexOf(focusRow);
        this.focusColumnIndex = focusRow.focusColumnIndex;
        this.setAttribute("tabIndex", "-1");
        this.isUpdatingFocus = false;
    }
    /**
     * @internal
     */
    handleFocus(e) {
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
    }
    /**
     * @internal
     */
    handleFocusOut(e) {
        if (e.relatedTarget === null || !this.contains(e.relatedTarget)) {
            this.setAttribute("tabIndex", "0");
        }
    }
    /**
     * @internal
     */
    handleKeydown(e) {
        if (e.defaultPrevented) {
            return;
        }
        let newFocusRowIndex;
        const maxIndex = this.rowElements.length - 1;
        const currentGridBottom = this.offsetHeight + this.scrollTop;
        const lastRow = this.rowElements[maxIndex];
        switch (e.keyCode) {
            case keyCodeArrowUp:
                e.preventDefault();
                // focus up one row
                this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, true);
                break;
            case keyCodeArrowDown:
                e.preventDefault();
                // focus down one row
                this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, true);
                break;
            case keyCodePageUp:
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
                    const thisRow = this.rowElements[newFocusRowIndex];
                    if (thisRow.offsetTop < this.scrollTop) {
                        this.scrollTop =
                            thisRow.offsetTop + thisRow.clientHeight - this.clientHeight;
                        break;
                    }
                }
                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);
                break;
            case keyCodePageDown:
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
                    const thisRow = this.rowElements[newFocusRowIndex];
                    if (thisRow.offsetTop + thisRow.offsetHeight > currentGridBottom) {
                        let stickyHeaderOffset = 0;
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
            case keyCodeHome:
                if (e.ctrlKey) {
                    e.preventDefault();
                    // focus first cell of first row
                    this.focusOnCell(0, 0, true);
                }
                break;
            case keyCodeEnd:
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
    queueFocusUpdate() {
        if (
            this.isUpdatingFocus &&
            (this.contains(document.activeElement) || this === document.activeElement)
        ) {
            return;
        }
        if (this.pendingFocusUpdate === false) {
            this.pendingFocusUpdate = true;
            DOM.queueUpdate(() => this.updateFocus());
        }
    }
    updateFocus() {
        this.pendingFocusUpdate = false;
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
    }
    toggleGeneratedHeader() {
        if (this.generatedHeader !== null) {
            this.removeChild(this.generatedHeader);
            this.generatedHeader = null;
        }
        if (this.generateHeader !== GenerateHeaderOptions.none) {
            const generatedHeaderElement = document.createElement(this.rowElementTag);
            this.generatedHeader = generatedHeaderElement;
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
}
/**
 *  generates a basic column definition by examining sample row data
 */
DataGrid.generateColumns = row => {
    return Object.getOwnPropertyNames(row).map((property, index) => {
        return {
            columnDataKey: property,
            gridColumn: `${index}`,
        };
    });
};
__decorate(
    [attr({ attribute: "generate-header" })],
    DataGrid.prototype,
    "generateHeader",
    void 0
);
__decorate(
    [attr({ attribute: "grid-template-columns" })],
    DataGrid.prototype,
    "gridTemplateColumns",
    void 0
);
__decorate([observable], DataGrid.prototype, "rowsData", void 0);
__decorate([observable], DataGrid.prototype, "columnDefinitions", void 0);
__decorate([observable], DataGrid.prototype, "rowItemTemplate", void 0);
__decorate([observable], DataGrid.prototype, "cellItemTemplate", void 0);
__decorate([observable], DataGrid.prototype, "headerCellItemTemplate", void 0);
__decorate([observable], DataGrid.prototype, "focusRowIndex", void 0);
__decorate([observable], DataGrid.prototype, "focusColumnIndex", void 0);
__decorate([observable], DataGrid.prototype, "defaultRowItemTemplate", void 0);
__decorate([observable], DataGrid.prototype, "rowElementTag", void 0);
__decorate([observable], DataGrid.prototype, "rowElements", void 0);
